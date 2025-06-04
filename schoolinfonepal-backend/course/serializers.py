from rest_framework import serializers
from .models import Course, CourseAttachment
from university.models import University
from level.models import Level
from discipline.models import Discipline
from django.utils.text import slugify

class CourseAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAttachment
        fields = ['id', 'file', 'description']

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    attachments = CourseAttachmentSerializer(many=True, required=False)
    disciplines = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Discipline.objects.all(), required=False
    )
    level = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), required=False, allow_null=True
    )
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'abbreviation', 'slug', 'university',
            'duration', 'level', 'disciplines', 'short_description',
            'outcome', 'eligibility', 'curriculum',
            'attachments',
            'meta_title', 'meta_description',
            'og_title', 'og_description', 'og_image',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        attachments_data = validated_data.pop('attachments', [])
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

        for attachment in attachments_data:
            CourseAttachment.objects.create(course=course, **attachment)

        return course

    def update(self, instance, validated_data):
        attachments_data = validated_data.pop('attachments', None)
        disciplines_data = validated_data.pop('disciplines', None)

        validated_data.pop("slug", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if disciplines_data is not None:
            instance.disciplines.set(disciplines_data)

        if attachments_data is not None:
            instance.attachments.all().delete()
            for attachment in attachments_data:
                CourseAttachment.objects.create(course=instance, **attachment)

        return instance
