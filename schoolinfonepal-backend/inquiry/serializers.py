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
    school_id = serializers.IntegerField(write_only=True, required=False)
    course_id = serializers.IntegerField(write_only=True, required=False)

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
        
        inquiry = Inquiry.objects.create(**validated_data)
        
        if school_id:
            try:
                school = School.objects.get(id=school_id)
                inquiry.school = school
            except School.DoesNotExist:
                pass
                
        if course_id:
            try:
                course = Course.objects.get(id=course_id)
                inquiry.course = course
            except Course.DoesNotExist:
                pass
                
        inquiry.save()
        return inquiry

class PreRegistrationInquirySerializer(serializers.ModelSerializer):
    school = SchoolMinimalSerializer(read_only=True)
    course = CourseMinimalSerializer(read_only=True)
    school_id = serializers.IntegerField(write_only=True, required=False)
    course_id = serializers.IntegerField(write_only=True, required=False)

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
        
        inquiry = PreRegistrationInquiry.objects.create(**validated_data)
        
        if school_id:
            try:
                school = School.objects.get(id=school_id)
                inquiry.school = school
            except School.DoesNotExist:
                pass
                
        if course_id:
            try:
                course = Course.objects.get(id=course_id)
                inquiry.course = course
            except Course.DoesNotExist:
                pass
                
        inquiry.save()
        return inquiry
