from rest_framework import serializers
from .models import Event
from school.models import School
from university.models import University

class EventSerializer(serializers.ModelSerializer):
    organizer_school = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=School.objects.all(),
        required=False,
        allow_null=True
    )
    organizer_university = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=University.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug',
            'event_date', 'event_end_date', 'time',
            'organizer_school', 'organizer_university', 'organizer_custom',
            'venue', 'event_type', 'seat_limit',
            'registration_type', 'registration_price', 'registration_link',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

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
