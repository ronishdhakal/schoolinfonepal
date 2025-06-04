from rest_framework import serializers
from .models import Admission
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University

class AdmissionSerializer(serializers.ModelSerializer):
    school = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=School.objects.all()
    )
    courses = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Course.objects.all(),
        many=True,
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
        queryset=University.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Admission
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'school', 'courses', 'level', 'university',
            'featured', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        courses_data = validated_data.pop('courses', [])
        admission = Admission.objects.create(**validated_data)
        admission.courses.set(courses_data)
        return admission

    def update(self, instance, validated_data):
        courses_data = validated_data.pop('courses', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if courses_data is not None:
            instance.courses.set(courses_data)
        return instance
