from rest_framework import serializers
from .models import Scholarship
from school.models import School
from university.models import University
from course.models import Course
from level.models import Level

class ScholarshipSerializer(serializers.ModelSerializer):
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
        model = Scholarship
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'organizer_school', 'organizer_university', 'organizer_custom',
            'courses', 'level', 'university',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def validate(self, attrs):
        if not (
            attrs.get('organizer_school') or
            attrs.get('organizer_university') or
            attrs.get('organizer_custom')
        ):
            raise serializers.ValidationError("Please specify at least one organizer: school, university, or custom text.")
        return attrs

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        instance = Scholarship.objects.create(**validated_data)
        instance.courses.set(courses)
        return instance

    def update(self, instance, validated_data):
        courses = validated_data.pop('courses', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if courses is not None:
            instance.courses.set(courses)

        return instance
