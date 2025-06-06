from rest_framework import serializers
from .models import Event
from school.models import School
from university.models import University
from django.utils.text import slugify

class EventSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    organizer_school = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(),
        required=False,
        allow_null=True
    )
    organizer_university = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'event_date', 'event_end_date', 'time', 'venue', 'event_type', 'seat_limit',
            'organizer_school', 'organizer_university', 'organizer_custom',
            'registration_type', 'registration_price', 'registration_link', 'registration_deadline',
            'featured_image', 'banner_image',
            'meta_title', 'meta_description', 'meta_keywords',
            'featured', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        if not (
            attrs.get('organizer_school') or
            attrs.get('organizer_university') or
            attrs.get('organizer_custom')
        ):
            raise serializers.ValidationError("Please specify at least one organizer: school, university, or custom.")

        if attrs.get('registration_type') == 'paid' and not attrs.get('registration_price'):
            raise serializers.ValidationError("Registration price is required for paid events.")

        return attrs

    def create(self, validated_data):
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "event"))
        slug = base_slug
        counter = 1
        while Event.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("slug", None)  # Prevent slug change
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
