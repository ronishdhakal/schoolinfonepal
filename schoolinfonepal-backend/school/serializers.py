from rest_framework import serializers
from django.utils.text import slugify
from .models import (
    School, SchoolPhone, SchoolEmail, SchoolGallery, SchoolBrochure,
    SchoolSocialMedia, SchoolFAQ, SchoolMessage, SchoolCourse
)
from district.models import District
from level.models import Level
from type.models import Type
from facility.models import Facility
from university.models import University
from course.models import Course

class SchoolPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolPhone
        fields = ['id', 'phone']

class SchoolEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolEmail
        fields = ['id', 'email']

class SchoolGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolGallery
        fields = ['id', 'image', 'caption']

class SchoolBrochureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolBrochure
        fields = ['id', 'file', 'description']

class SchoolSocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSocialMedia
        fields = ['id', 'platform', 'url']

class SchoolFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolFAQ
        fields = ['id', 'question', 'answer']

class SchoolMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolMessage
        fields = ['id', 'image', 'title', 'message', 'name', 'designation']

class SchoolCourseSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    class Meta:
        model = SchoolCourse
        fields = ['id', 'course', 'fee', 'status', 'admin_open']

class SchoolSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    phones = SchoolPhoneSerializer(many=True, required=False)
    emails = SchoolEmailSerializer(many=True, required=False)
    gallery = SchoolGallerySerializer(many=True, required=False)
    brochures = SchoolBrochureSerializer(many=True, required=False)
    social_media = SchoolSocialMediaSerializer(many=True, required=False)
    faqs = SchoolFAQSerializer(many=True, required=False)
    messages = SchoolMessageSerializer(many=True, required=False)
    school_courses = SchoolCourseSerializer(many=True, required=False)

    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all(), allow_null=True, required=False)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), allow_null=True, required=False)
    type = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), allow_null=True, required=False)
    facilities = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), many=True, required=False)
    universities = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), many=True, required=False)

    class Meta:
        model = School
        fields = [
            'id', 'user', 'name', 'slug', 'logo', 'cover_photo', 'address', 'established_date',
            'verification', 'featured', 'district', 'level', 'level_text', 'type', 'facilities',
            'universities', 'website', 'priority', 'map_link', 'gallery', 'phones', 'emails',
            'salient_feature', 'scholarship', 'about_college', 'brochures', 'social_media',
            'faqs', 'messages', 'school_courses', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # --- Pop nested fields, default to []
        nested = {}
        for field in [
            'phones', 'emails', 'gallery', 'brochures',
            'social_media', 'faqs', 'messages', 'school_courses'
        ]:
            nested[field] = validated_data.pop(field, [])

        facilities = validated_data.pop('facilities', [])
        universities = validated_data.pop('universities', [])

        # Unique slug logic
        base_slug = slugify(validated_data.get("slug") or validated_data.get("name", "school"))
        slug = base_slug
        counter = 1
        while School.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        school = School.objects.create(**validated_data)
        school.facilities.set(facilities)
        school.universities.set(universities)

        # Save nested fields (files handled in the view, not here)
        for item in nested['phones']:
            if item.get('phone'):
                SchoolPhone.objects.create(school=school, phone=item['phone'])
        for item in nested['emails']:
            if item.get('email'):
                SchoolEmail.objects.create(school=school, email=item['email'])
        for item in nested['gallery']:
            SchoolGallery.objects.create(school=school, **item)
        for item in nested['brochures']:
            SchoolBrochure.objects.create(school=school, **item)
        for item in nested['social_media']:
            SchoolSocialMedia.objects.create(school=school, **item)
        for item in nested['faqs']:
            SchoolFAQ.objects.create(school=school, **item)
        for item in nested['messages']:
            SchoolMessage.objects.create(school=school, **item)
        for item in nested['school_courses']:
            SchoolCourse.objects.create(school=school, **item)

        return school

    def update(self, instance, validated_data):
        nested = {}
        for field in [
            'phones', 'emails', 'gallery', 'brochures',
            'social_media', 'faqs', 'messages', 'school_courses'
        ]:
            nested[field] = validated_data.pop(field, None)

        facilities = validated_data.pop('facilities', None)
        universities = validated_data.pop('universities', None)
        validated_data.pop("slug", None)  # Don't update slug

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if facilities is not None:
            instance.facilities.set(facilities)
        if universities is not None:
            instance.universities.set(universities)

        # Replace nested: delete all, add new
        if nested['phones'] is not None:
            instance.phones.all().delete()
            for item in nested['phones']:
                if item.get('phone'):
                    SchoolPhone.objects.create(school=instance, phone=item['phone'])
        if nested['emails'] is not None:
            instance.emails.all().delete()
            for item in nested['emails']:
                if item.get('email'):
                    SchoolEmail.objects.create(school=instance, email=item['email'])
        if nested['gallery'] is not None:
            instance.gallery.all().delete()
            for item in nested['gallery']:
                SchoolGallery.objects.create(school=instance, **item)
        if nested['brochures'] is not None:
            instance.brochures.all().delete()
            for item in nested['brochures']:
                SchoolBrochure.objects.create(school=instance, **item)
        if nested['social_media'] is not None:
            instance.social_media.all().delete()
            for item in nested['social_media']:
                SchoolSocialMedia.objects.create(school=instance, **item)
        if nested['faqs'] is not None:
            instance.faqs.all().delete()
            for item in nested['faqs']:
                SchoolFAQ.objects.create(school=instance, **item)
        if nested['messages'] is not None:
            instance.messages.all().delete()
            for item in nested['messages']:
                SchoolMessage.objects.create(school=instance, **item)
        if nested['school_courses'] is not None:
            instance.school_courses.all().delete()
            for item in nested['school_courses']:
                SchoolCourse.objects.create(school=instance, **item)

        return instance
