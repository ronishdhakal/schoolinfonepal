from rest_framework import serializers
from .models import Information, InformationCategory
from university.models import University
from level.models import Level
from course.models import Course
from school.models import School  # ✅ changed from college to school

class InformationSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=InformationCategory.objects.all()
    )
    universities = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=University.objects.all(),
        required=False
    )
    levels = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=Level.objects.all(),
        required=False
    )
    courses = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=Course.objects.all(),
        required=False
    )
    schools = serializers.SlugRelatedField(  # ✅ updated field name
        many=True,
        slug_field='slug',
        queryset=School.objects.all(),
        required=False
    )

    class Meta:
        model = Information
        fields = [
            'id', 'title', 'slug', 'category', 'published_date',
            'featured_image', 'universities', 'levels', 'courses', 'schools',
            'top_description', 'below_description',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        universities = validated_data.pop('universities', [])
        levels = validated_data.pop('levels', [])
        courses = validated_data.pop('courses', [])
        schools = validated_data.pop('schools', [])  # ✅ updated

        info = Information.objects.create(**validated_data)
        info.universities.set(universities)
        info.levels.set(levels)
        info.courses.set(courses)
        info.schools.set(schools)  # ✅ updated
        return info

    def update(self, instance, validated_data):
        universities = validated_data.pop('universities', None)
        levels = validated_data.pop('levels', None)
        courses = validated_data.pop('courses', None)
        schools = validated_data.pop('schools', None)  # ✅ updated

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
            instance.schools.set(schools)  # ✅ updated
        return instance
