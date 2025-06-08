from rest_framework import serializers
from .models import Course, CourseAttachment
from university.models import University
from level.models import Level
from discipline.models import Discipline
from django.utils.text import slugify

# Minimal serializer for university (id, name)
class UniversityMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

# Minimal serializer for level (id, title)
class LevelMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'title']

class CourseAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAttachment
        fields = ['id', 'file', 'description']

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    attachments = CourseAttachmentSerializer(many=True, required=False, read_only=True)
    disciplines = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Discipline.objects.all(), required=False
    )

    # Output: nested object (read-only)
    university = UniversityMinimalSerializer(read_only=True)
    level = LevelMinimalSerializer(read_only=True)
    # Input: accept ID for create/update
    university_id = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), source='university', write_only=True, required=False
    )
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), source='level', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'abbreviation', 'slug',
            'university', 'university_id',        # <-- output+input
            'duration', 'level', 'level_id',      # <-- output+input
            'disciplines', 'short_description', 'long_description',
            'outcome', 'eligibility', 'curriculum',
            'attachments',
            'meta_title', 'meta_description',
            'og_title', 'og_description', 'og_image',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'university', 'level']

    def create(self, validated_data):
        disciplines_data = validated_data.pop('disciplines', [])
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("name", "course"))
        slug = base_slug
        counter = 1
        while Course.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        course = Course.objects.create(**validated_data)
        course.disciplines.set(disciplines_data)
        return course

    def update(self, instance, validated_data):
        disciplines_data = validated_data.pop('disciplines', None)
        validated_data.pop("slug", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if disciplines_data is not None:
            instance.disciplines.set(disciplines_data)
        return instance
