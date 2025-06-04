from rest_framework import serializers
from .models import Information, InformationCategory
from university.models import University
from level.models import Level
from course.models import Course
from school.models import School
from django.utils.text import slugify

class InformationSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    category = serializers.PrimaryKeyRelatedField(queryset=InformationCategory.objects.all())
    universities = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), many=True, required=False)
    levels = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), many=True, required=False)
    courses = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), many=True, required=False)
    schools = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), many=True, required=False)

    class Meta:
        model = Information
        fields = [
            'id', 'title', 'slug', 'category', 'published_date',
            'featured_image', 'universities', 'levels', 'courses', 'schools',
            'top_description', 'below_description',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        universities = validated_data.pop('universities', [])
        levels = validated_data.pop('levels', [])
        courses = validated_data.pop('courses', [])
        schools = validated_data.pop('schools', [])

        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "information"))
        slug = base_slug
        counter = 1
        while Information.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        info = Information.objects.create(**validated_data)
        info.universities.set(universities)
        info.levels.set(levels)
        info.courses.set(courses)
        info.schools.set(schools)
        return info

    def update(self, instance, validated_data):
        universities = validated_data.pop('universities', None)
        levels = validated_data.pop('levels', None)
        courses = validated_data.pop('courses', None)
        schools = validated_data.pop('schools', None)

        validated_data.pop("slug", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if universities is not None:
            instance.universities.set(universities)
        if levels is not None:
            instance.levels.set(levels)
        if courses is not None:
            instance.courses.set(courses)
        if schools is not None:
            instance.schools.set(schools)
        return instance
