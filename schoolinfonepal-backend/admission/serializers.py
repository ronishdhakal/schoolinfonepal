from rest_framework import serializers
from .models import Admission
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University
from django.utils.text import slugify

class AdmissionSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())
    courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, required=False)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), required=False, allow_null=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Admission
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'school', 'courses', 'level', 'university',
            'featured', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        courses_data = validated_data.pop('courses', [])
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "admission"))
        slug = base_slug
        counter = 1
        while Admission.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        admission = Admission.objects.create(**validated_data)
        admission.courses.set(courses_data)
        return admission

    def update(self, instance, validated_data):
        courses_data = validated_data.pop('courses', None)
        validated_data.pop("slug", None)  # Don't allow slug change

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if courses_data is not None:
            instance.courses.set(courses_data)

        return instance
