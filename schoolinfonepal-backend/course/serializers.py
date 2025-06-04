from rest_framework import serializers
from .models import Course, CourseAttachment
from university.models import University
from level.models import Level
from discipline.models import Discipline

class CourseAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAttachment
        fields = ['id', 'file', 'description']

class CourseSerializer(serializers.ModelSerializer):
    attachments = CourseAttachmentSerializer(many=True, required=False)
    disciplines = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=Discipline.objects.all(),
        required=False
    )
    level = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Level.objects.all(),
        required=False,
        allow_null=True
    )
    university = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=University.objects.all()
    )

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
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        attachments_data = validated_data.pop('attachments', [])
        disciplines_data = validated_data.pop('disciplines', [])
        course = Course.objects.create(**validated_data)
        if disciplines_data:
            course.disciplines.set(disciplines_data)
        for attachment in attachments_data:
            CourseAttachment.objects.create(course=course, **attachment)
        return course

    def update(self, instance, validated_data):
        attachments_data = validated_data.pop('attachments', [])
        disciplines_data = validated_data.pop('disciplines', [])

        # Update simple fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update disciplines
        if disciplines_data:
            instance.disciplines.set(disciplines_data)

        # Update attachments
        if attachments_data:
            instance.attachments.all().delete()
            for attachment in attachments_data:
                CourseAttachment.objects.create(course=instance, **attachment)
        return instance
