from rest_framework import serializers
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

# For School-Course through model with extra fields
class SchoolCourseSerializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Course.objects.all()
    )

    class Meta:
        model = SchoolCourse
        fields = ['id', 'course', 'fee', 'status', 'admin_open']

class SchoolSerializer(serializers.ModelSerializer):
    phones = SchoolPhoneSerializer(many=True, required=False)
    emails = SchoolEmailSerializer(many=True, required=False)
    gallery = SchoolGallerySerializer(many=True, required=False)
    brochures = SchoolBrochureSerializer(many=True, required=False)
    social_media = SchoolSocialMediaSerializer(many=True, required=False)
    faqs = SchoolFAQSerializer(many=True, required=False)
    messages = SchoolMessageSerializer(many=True, required=False)
    school_courses = SchoolCourseSerializer(many=True, required=False, source='school_courses')

    district = serializers.SlugRelatedField(
        slug_field='slug', queryset=District.objects.all(), required=False, allow_null=True
    )
    level = serializers.SlugRelatedField(
        slug_field='slug', queryset=Level.objects.all(), required=False, allow_null=True
    )
    type = serializers.SlugRelatedField(
        slug_field='slug', queryset=Type.objects.all(), required=False, allow_null=True
    )
    facilities = serializers.SlugRelatedField(
        many=True, slug_field='slug', queryset=Facility.objects.all(), required=False
    )
    universities = serializers.SlugRelatedField(
        many=True, slug_field='slug', queryset=University.objects.all(), required=False
    )

    class Meta:
        model = School
        fields = [
            'id', 'user', 'name', 'slug', 'logo', 'cover_photo', 'address', 'established_date',
            'verification', 'featured', 'district', 'level', 'level_text', 'type', 'facilities',
            'universities', 'website', 'priority', 'map_link', 'gallery', 'phones', 'emails',
            'salient_feature', 'scholarship', 'about_college', 'brochures', 'social_media',
            'faqs', 'messages', 'school_courses',
        ]
        read_only_fields = ['slug']

    def create(self, validated_data):
        # Pop nested fields
        phones_data = validated_data.pop('phones', [])
        emails_data = validated_data.pop('emails', [])
        gallery_data = validated_data.pop('gallery', [])
        brochures_data = validated_data.pop('brochures', [])
        social_media_data = validated_data.pop('social_media', [])
        faqs_data = validated_data.pop('faqs', [])
        messages_data = validated_data.pop('messages', [])
        school_courses_data = validated_data.pop('school_courses', [])

        # ManyToMany simple (facilities, universities)
        facilities = validated_data.pop('facilities', [])
        universities = validated_data.pop('universities', [])

        school = School.objects.create(**validated_data)
        school.facilities.set(facilities)
        school.universities.set(universities)

        # Nested fields create
        for phone in phones_data:
            SchoolPhone.objects.create(school=school, **phone)
        for email in emails_data:
            SchoolEmail.objects.create(school=school, **email)
        for image in gallery_data:
            SchoolGallery.objects.create(school=school, **image)
        for brochure in brochures_data:
            SchoolBrochure.objects.create(school=school, **brochure)
        for social in social_media_data:
            SchoolSocialMedia.objects.create(school=school, **social)
        for faq in faqs_data:
            SchoolFAQ.objects.create(school=school, **faq)
        for message in messages_data:
            SchoolMessage.objects.create(school=school, **message)
        for sc in school_courses_data:
            # sc['course'] is a Course instance from slug field
            SchoolCourse.objects.create(school=school, **sc)

        return school

    def update(self, instance, validated_data):
        # Pop nested fields
        phones_data = validated_data.pop('phones', [])
        emails_data = validated_data.pop('emails', [])
        gallery_data = validated_data.pop('gallery', [])
        brochures_data = validated_data.pop('brochures', [])
        social_media_data = validated_data.pop('social_media', [])
        faqs_data = validated_data.pop('faqs', [])
        messages_data = validated_data.pop('messages', [])
        school_courses_data = validated_data.pop('school_courses', [])

        # ManyToMany simple (facilities, universities)
        facilities = validated_data.pop('facilities', [])
        universities = validated_data.pop('universities', [])

        # Update direct fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.facilities.set(facilities)
        instance.universities.set(universities)

        # Update nested - clear and recreate
        if phones_data:
            instance.phones.all().delete()
            for phone in phones_data:
                SchoolPhone.objects.create(school=instance, **phone)
        if emails_data:
            instance.emails.all().delete()
            for email in emails_data:
                SchoolEmail.objects.create(school=instance, **email)
        if gallery_data:
            instance.gallery.all().delete()
            for image in gallery_data:
                SchoolGallery.objects.create(school=instance, **image)
        if brochures_data:
            instance.brochures.all().delete()
            for brochure in brochures_data:
                SchoolBrochure.objects.create(school=instance, **brochure)
        if social_media_data:
            instance.social_media.all().delete()
            for social in social_media_data:
                SchoolSocialMedia.objects.create(school=instance, **social)
        if faqs_data:
            instance.faqs.all().delete()
            for faq in faqs_data:
                SchoolFAQ.objects.create(school=instance, **faq)
        if messages_data:
            instance.messages.all().delete()
            for message in messages_data:
                SchoolMessage.objects.create(school=instance, **message)
        if school_courses_data:
            instance.school_courses.all().delete()
            for sc in school_courses_data:
                SchoolCourse.objects.create(school=instance, **sc)

        return instance
