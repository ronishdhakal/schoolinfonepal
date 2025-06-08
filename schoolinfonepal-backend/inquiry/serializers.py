from rest_framework import serializers
from .models import Inquiry, PreRegistrationInquiry
from school.models import School
from course.models import Course

class SchoolMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

class CourseMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

class InquirySerializer(serializers.ModelSerializer):
    school = SchoolMinimalSerializer(read_only=True)
    course = CourseMinimalSerializer(read_only=True)
    school_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    course_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'school', 'course', 'school_id', 'course_id',
            'full_name', 'email', 'phone', 'address', 'message',
            'contacted', 'contacted_at', 'created_at'
        ]

    def create(self, validated_data):
        school_id = validated_data.pop('school_id', None)
        course_id = validated_data.pop('course_id', None)

        create_kwargs = {**validated_data}
        if 'school' in create_kwargs:
            create_kwargs.pop('school')
        if 'course' in create_kwargs:
            create_kwargs.pop('course')

        # Assign related FKs before creating the object
        if school_id is not None:
            try:
                create_kwargs['school'] = School.objects.get(id=school_id)
            except School.DoesNotExist:
                raise serializers.ValidationError({"school_id": "School not found."})
        if course_id is not None:
            try:
                create_kwargs['course'] = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                create_kwargs['course'] = None

        inquiry = Inquiry.objects.create(**create_kwargs)
        return inquiry

class PreRegistrationInquirySerializer(serializers.ModelSerializer):
    school = SchoolMinimalSerializer(read_only=True)
    course = CourseMinimalSerializer(read_only=True)
    school_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    course_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = PreRegistrationInquiry
        fields = [
            'id', 'school', 'course', 'school_id', 'course_id',
            'full_name', 'email', 'phone', 'address', 'level', 'message',
            'contacted', 'contacted_at', 'created_at'
        ]

    def create(self, validated_data):
        school_id = validated_data.pop('school_id', None)
        course_id = validated_data.pop('course_id', None)

        create_kwargs = {**validated_data}
        if 'school' in create_kwargs:
            create_kwargs.pop('school')
        if 'course' in create_kwargs:
            create_kwargs.pop('course')

        # Assign related FKs before creating the object
        if school_id is not None:
            try:
                create_kwargs['school'] = School.objects.get(id=school_id)
            except School.DoesNotExist:
                raise serializers.ValidationError({"school_id": "School not found."})
        if course_id is not None:
            try:
                create_kwargs['course'] = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                create_kwargs['course'] = None

        inquiry = PreRegistrationInquiry.objects.create(**create_kwargs)
        return inquiry
