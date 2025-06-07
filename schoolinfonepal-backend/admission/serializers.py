from rest_framework import serializers
from .models import Admission
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University
from django.utils.text import slugify

from school.serializers import SchoolSerializer
from course.serializers import CourseSerializer

class AdmissionSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    # For read: show school as nested object
    school = SchoolSerializer(read_only=True)
    # For write: allow ID input
    school_id = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), write_only=True, required=False, allow_null=True)

    # For read: show full course info
    courses = CourseSerializer(many=True, read_only=True)
    # For write: allow course IDs
    course_ids = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, write_only=True, required=False)

    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), required=False, allow_null=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Admission
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'school', 'school_id',
            'courses', 'course_ids',
            'level', 'university',
            'featured', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Extract course and school IDs
        course_ids = validated_data.pop('course_ids', [])
        school_obj = validated_data.pop('school_id', None)
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "admission"))
        slug = base_slug
        counter = 1
        while Admission.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        if school_obj:
            validated_data["school"] = school_obj

        admission = Admission.objects.create(**validated_data)
        if course_ids:
            admission.courses.set(course_ids)
        return admission

    def update(self, instance, validated_data):
        course_ids = validated_data.pop('course_ids', None)
        school_obj = validated_data.pop('school_id', None)
        validated_data.pop("slug", None)  # Don't allow slug change

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if school_obj is not None:
            instance.school = school_obj
        instance.save()

        if course_ids is not None:
            instance.courses.set(course_ids)

        return instance
