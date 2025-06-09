from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    School, SchoolPhone, SchoolEmail, SchoolGallery, 
    SchoolBrochure, SchoolSocialMedia, SchoolFAQ, 
    SchoolMessage, SchoolCourse
)
from district.models import District
from level.models import Level
from type.models import Type
from facility.models import Facility
from university.models import University
from course.models import Course
from inquiry.models import Inquiry, PreRegistrationInquiry
from inquiry.serializers import InquirySerializer, PreRegistrationInquirySerializer
from django.utils.text import slugify
import json
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'title']

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name']

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', ]

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'slug']

class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source="university.name", read_only=True)
    name = serializers.CharField()
    duration = serializers.CharField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'university_name', 'duration']

class SchoolPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolPhone
        fields = ['id', 'phone']

class SchoolEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolEmail
        fields = ['id', 'email']

class SchoolGallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SchoolGallery
        fields = ['id', 'image', 'caption']

    def get_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request and obj.image else None

class SchoolBrochureSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = SchoolBrochure
        fields = ['id', 'file', 'description']

    def get_file(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if request and obj.file else None

class SchoolSocialMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolSocialMedia
        fields = ['id', 'platform', 'url']

class SchoolFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolFAQ
        fields = ['id', 'question', 'answer']

class SchoolMessageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SchoolMessage
        fields = ['id', 'image', 'title', 'message', 'name', 'designation']

    def get_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request and obj.image else None

class SchoolCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SchoolCourse
        fields = ['id', 'course', 'course_id', 'fee', 'status', 'admin_open']

class SchoolSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(required=False, allow_blank=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    slug = serializers.CharField(required=False, allow_blank=True)
    logo = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()
    og_image = serializers.SerializerMethodField()

    # Related fields - read only for display
    district = DistrictSerializer(read_only=True)
    level = LevelSerializer(read_only=True)
    type = TypeSerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    universities = UniversitySerializer(many=True, read_only=True)

    # Write-only fields for IDs
    district_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    level_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    type_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    # Nested related models
    phones = SchoolPhoneSerializer(many=True, required=False)
    emails = SchoolEmailSerializer(many=True, required=False)
    gallery = SchoolGallerySerializer(many=True, read_only=True)
    brochures = SchoolBrochureSerializer(many=True, read_only=True)
    social_media = SchoolSocialMediaSerializer(many=True, required=False)
    faqs = SchoolFAQSerializer(many=True, required=False)
    messages = SchoolMessageSerializer(many=True, read_only=True)
    
    # ✅ FIXED: Make school_courses writable
    school_courses = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        write_only=True
    )
    school_courses_display = SchoolCourseSerializer(
        source='school_courses',
        many=True, 
        read_only=True
    )

    # Inquiries
    inquiries = serializers.SerializerMethodField()
    pre_registrations = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = [
            'id', 'admin_email', 'user_email', 'name', 'slug', 'logo', 'cover_photo', 'address',
            'established_date', 'verification', 'featured', 'district', 'district_id', 'level', 'level_id',
            'level_text', 'type', 'type_id', 'facilities', 'universities', 
            'website', 'priority', 'map_link', 'salient_feature', 'scholarship', 'about_college',
            'meta_title', 'meta_description', 'og_title', 'og_description', 'og_image',
            'created_at', 'updated_at', 'phones', 'emails', 'gallery', 'brochures',
            'social_media', 'faqs', 'messages', 'school_courses', 'school_courses_display', 
            'inquiries', 'pre_registrations'
        ]

    def to_internal_value(self, data):
        # Handle JSON fields that might come as strings
        json_fields = ['phones', 'emails', 'social_media', 'faqs', 'messages', 'school_courses']
        for field in json_fields:
            if field in data and isinstance(data[field], str):
                try:
                    data[field] = json.loads(data[field])
                    print(f"Parsed JSON for {field}: {data[field]}")
                except Exception as e:
                    print(f"Error parsing JSON for {field}: {e}")
                    data[field] = []
            
        return super().to_internal_value(data)

    def get_logo(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.logo.url) if request and obj.logo else None

    def get_cover_photo(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.cover_photo.url) if request and obj.cover_photo else None

    def get_og_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.og_image.url) if request and obj.og_image else None

    def get_inquiries(self, obj):
        inquiries = Inquiry.objects.filter(school=obj).order_by('-created_at')[:5]
        return InquirySerializer(inquiries, many=True).data

    def get_pre_registrations(self, obj):
        pre_registrations = PreRegistrationInquiry.objects.filter(school=obj).order_by('-created_at')[:5]
        return PreRegistrationInquirySerializer(pre_registrations, many=True).data

    def create(self, validated_data):
        # Extract nested data
        phones_data = validated_data.pop('phones', [])
        emails_data = validated_data.pop('emails', [])
        social_media_data = validated_data.pop('social_media', [])
        faqs_data = validated_data.pop('faqs', [])
        school_courses_data = validated_data.pop('school_courses', [])

        print(f"Creating school with school_courses: {school_courses_data}")

        # Create school
        school = School.objects.create(**validated_data)

        # Create related objects
        for phone_data in phones_data:
            SchoolPhone.objects.create(school=school, **phone_data)
        for email_data in emails_data:
            SchoolEmail.objects.create(school=school, **email_data)
        for social_data in social_media_data:
            SchoolSocialMedia.objects.create(school=school, **social_data)
        for faq_data in faqs_data:
            SchoolFAQ.objects.create(school=school, **faq_data)

        # ✅ FIXED: Create school courses
        self._process_school_courses(school, school_courses_data)

        return school

    def update(self, instance, validated_data):
        # Extract nested data
        phones_data = validated_data.pop('phones', None)
        emails_data = validated_data.pop('emails', None)
        social_media_data = validated_data.pop('social_media', None)
        faqs_data = validated_data.pop('faqs', None)
        school_courses_data = validated_data.pop('school_courses', None)

        print(f"Updating school with school_courses: {school_courses_data}")

        # Remove user_email from validated_data
        validated_data.pop('user_email', None)

        # Update school fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # ✅ FIXED: Only update related objects if data is provided
        if phones_data is not None:
            instance.phones.all().delete()
            for phone_data in phones_data:
                SchoolPhone.objects.create(school=instance, **phone_data)

        if emails_data is not None:
            instance.emails.all().delete()
            for email_data in emails_data:
                SchoolEmail.objects.create(school=instance, **email_data)

        if social_media_data is not None:
            instance.social_media.all().delete()
            for social_data in social_media_data:
                SchoolSocialMedia.objects.create(school=instance, **social_data)

        if faqs_data is not None:
            instance.faqs.all().delete()
            for faq_data in faqs_data:
                SchoolFAQ.objects.create(school=instance, **faq_data)

        # ✅ FIXED: Only update school courses if data is provided
        if school_courses_data is not None:
            self._process_school_courses(instance, school_courses_data)

        return instance
    
    def _process_school_courses(self, school, school_courses_data):
        """Process school courses data and create/update SchoolCourse objects"""
        print(f"Processing school courses: {school_courses_data}")
        
        # Delete existing courses if we're updating
        school.school_courses.all().delete()
        
        # Process each course
        for course_data in school_courses_data:
            course_id = None
            fee = None
            status = ""
            admin_open = True
            
            # Handle different formats of course data
            if isinstance(course_data, dict):
                course_id = course_data.get('course_id')
                if course_id is None and 'id' in course_data:
                    course_id = course_data.get('id')
                fee = course_data.get('fee')
                status = course_data.get('status', 'Open')  # Default status
                admin_open = course_data.get('admin_open', True)
            elif isinstance(course_data, int) or (isinstance(course_data, str) and course_data.isdigit()):
                course_id = int(course_data)
                status = 'Open'  # Default status for simple course IDs
            
            print(f"Processing course_id: {course_id}, fee: {fee}, status: {status}")
            
            # ✅ FIXED: Allow courses without fees - only require course_id
            if course_id:
                try:
                    course = Course.objects.get(id=course_id)
                    
                    # ✅ FIXED: Handle fee properly - allow None/empty values
                    processed_fee = None
                    if fee is not None and fee != "":
                        try:
                            processed_fee = float(fee)
                        except (ValueError, TypeError):
                            processed_fee = None
                    
                    SchoolCourse.objects.create(
                        school=school,
                        course=course,
                        fee=processed_fee,  # Allow None fees
                        status=status or 'Open',  # Ensure status is not empty
                        admin_open=admin_open
                    )
                    print(f"Created SchoolCourse for course_id: {course_id} with fee: {processed_fee}")
                except Course.DoesNotExist:
                    print(f"Course with id {course_id} does not exist")
                except Exception as e:
                    print(f"Error creating SchoolCourse: {e}")

class SchoolMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']
