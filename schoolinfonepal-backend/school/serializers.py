import json
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
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = SchoolCourse
        fields = ['id', 'course', 'course_name', 'fee', 'status', 'admin_open']

class SchoolSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    # Make nested fields read-only to prevent validation issues
    phones = SchoolPhoneSerializer(many=True, required=False, read_only=True)
    emails = SchoolEmailSerializer(many=True, required=False, read_only=True)
    gallery = SchoolGallerySerializer(many=True, required=False, read_only=True)
    brochures = SchoolBrochureSerializer(many=True, required=False, read_only=True)
    social_media = SchoolSocialMediaSerializer(many=True, required=False, read_only=True)
    faqs = SchoolFAQSerializer(many=True, required=False, read_only=True)
    messages = SchoolMessageSerializer(many=True, required=False, read_only=True)
    school_courses = SchoolCourseSerializer(many=True, required=False, read_only=True)

    # Foreign key fields
    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all(), allow_null=True, required=False)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), allow_null=True, required=False)
    type = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), allow_null=True, required=False)
    facilities = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), many=True, required=False)
    universities = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), many=True, required=False)

    # Add display names for foreign keys
    district_name = serializers.CharField(source='district.name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    type_name = serializers.CharField(source='type.name', read_only=True)

    class Meta:
        model = School
        fields = [
            'id', 'user', 'name', 'slug', 'logo', 'cover_photo', 'address', 'established_date',
            'verification', 'featured', 'district', 'district_name', 'level', 'level_name', 
            'level_text', 'type', 'type_name', 'facilities', 'universities', 'website', 
            'priority', 'map_link', 'gallery', 'phones', 'emails', 'salient_feature', 
            'scholarship', 'about_college', 'brochures', 'social_media', 'faqs', 'messages', 
            'school_courses', 'meta_title', 'meta_description', 'og_title', 'og_description', 
            'og_image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def safe_json_loads(self, raw, fallback):
        if not raw:
            return fallback
        try:
            return json.loads(raw) if isinstance(raw, str) else raw
        except:
            return fallback

    def create(self, validated_data):
        request = self.context.get("request")
        raw_data = request.data if request else {}

        # Remove M2M fields
        facilities = validated_data.pop('facilities', [])
        universities = validated_data.pop('universities', [])

        # Create unique slug
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

        # Handle nested data
        self._create_nested_objects(school, raw_data)

        return school

    def update(self, instance, validated_data):
        request = self.context.get("request")
        raw_data = request.data if request else {}

        # Handle M2M fields
        facilities = validated_data.pop('facilities', None)
        universities = validated_data.pop('universities', None)
        validated_data.pop("slug", None)  # Don't update slug

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if facilities is not None:
            instance.facilities.set(facilities)
        if universities is not None:
            instance.universities.set(universities)

        # Handle nested data only if provided
        self._update_nested_objects(instance, raw_data)

        return instance

    def _create_nested_objects(self, school, raw_data):
        # Create phones
        phones_data = self.safe_json_loads(raw_data.get("phones"), [])
        for phone in phones_data:
            if phone.get('phone'):
                SchoolPhone.objects.create(school=school, phone=phone['phone'])

        # Create emails
        emails_data = self.safe_json_loads(raw_data.get("emails"), [])
        for email in emails_data:
            if email.get('email'):
                SchoolEmail.objects.create(school=school, email=email['email'])

        # Create social media
        social_media_data = self.safe_json_loads(raw_data.get("social_media"), [])
        for sm in social_media_data:
            if sm.get('platform') or sm.get('url'):
                SchoolSocialMedia.objects.create(school=school, **sm)

        # Create FAQs
        faqs_data = self.safe_json_loads(raw_data.get("faqs"), [])
        for faq in faqs_data:
            if faq.get('question') or faq.get('answer'):
                SchoolFAQ.objects.create(school=school, **faq)

        # Create school courses - FIX: Convert course ID to Course instance
        school_courses_data = self.safe_json_loads(raw_data.get("school_courses"), [])
        for sc in school_courses_data:
            if sc.get('course'):
                try:
                    course_id = int(sc['course'])
                    course = Course.objects.get(id=course_id)
                    SchoolCourse.objects.create(
                        school=school,
                        course=course,
                        fee=sc.get('fee') or None,
                        status=sc.get('status', 'Open'),
                        admin_open=sc.get('admin_open', True)
                    )
                except (ValueError, Course.DoesNotExist):
                    continue

    def _update_nested_objects(self, school, raw_data):
        # Update phones if provided
        if "phones" in raw_data:
            school.phones.all().delete()
            phones_data = self.safe_json_loads(raw_data.get("phones"), [])
            for phone in phones_data:
                if phone.get('phone'):
                    SchoolPhone.objects.create(school=school, phone=phone['phone'])

        # Update emails if provided
        if "emails" in raw_data:
            school.emails.all().delete()
            emails_data = self.safe_json_loads(raw_data.get("emails"), [])
            for email in emails_data:
                if email.get('email'):
                    SchoolEmail.objects.create(school=school, email=email['email'])

        # Update social media if provided
        if "social_media" in raw_data:
            school.social_media.all().delete()
            social_media_data = self.safe_json_loads(raw_data.get("social_media"), [])
            for sm in social_media_data:
                if sm.get('platform') or sm.get('url'):
                    SchoolSocialMedia.objects.create(school=school, **sm)

        # Update FAQs if provided
        if "faqs" in raw_data:
            school.faqs.all().delete()
            faqs_data = self.safe_json_loads(raw_data.get("faqs"), [])
            for faq in faqs_data:
                if faq.get('question') or faq.get('answer'):
                    SchoolFAQ.objects.create(school=school, **faq)

        # Update school courses if provided - FIX: Convert course ID to Course instance
        if "school_courses" in raw_data:
            school.school_courses.all().delete()
            school_courses_data = self.safe_json_loads(raw_data.get("school_courses"), [])
            for sc in school_courses_data:
                if sc.get('course'):
                    try:
                        course_id = int(sc['course'])
                        course = Course.objects.get(id=course_id)
                        SchoolCourse.objects.create(
                            school=school,
                            course=course,
                            fee=sc.get('fee') or None,
                            status=sc.get('status', 'Open'),
                            admin_open=sc.get('admin_open', True)
                        )
                    except (ValueError, Course.DoesNotExist):
                        continue
