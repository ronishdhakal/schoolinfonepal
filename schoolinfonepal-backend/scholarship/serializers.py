from rest_framework import serializers
from .models import Scholarship
from school.models import School
from university.models import University
from course.models import Course
from level.models import Level
from django.utils.text import slugify

class ScholarshipSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    
    organizer_school = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), required=False, allow_null=True
    )
    organizer_university = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), required=False, allow_null=True
    )
    courses = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), many=True, required=False
    )
    level = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), required=False, allow_null=True
    )
    university = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'organizer_school', 'organizer_university', 'organizer_custom',
            'courses', 'level', 'university',
            'description', 'attachment',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        # Ensure at least one organizer is provided
        if not (
            attrs.get('organizer_school') or
            attrs.get('organizer_university') or
            attrs.get('organizer_custom')
        ):
            raise serializers.ValidationError(
                "Please specify at least one organizer: school, university, or custom text."
            )
        
        # Validate date range
        active_from = attrs.get('active_from')
        active_until = attrs.get('active_until')
        
        if active_from and active_until and active_from >= active_until:
            raise serializers.ValidationError(
                "Active until date must be after active from date."
            )
        
        return attrs

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        
        # Generate unique slug
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "scholarship"))
        slug = base_slug
        counter = 1
        while Scholarship.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        instance = Scholarship.objects.create(**validated_data)
        instance.courses.set(courses)
        return instance

    def update(self, instance, validated_data):
        courses = validated_data.pop('courses', None)
        
        # Remove slug from validated_data to prevent updates
        validated_data.pop("slug", None)

        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update courses if provided
        if courses is not None:
            instance.courses.set(courses)

        return instance
