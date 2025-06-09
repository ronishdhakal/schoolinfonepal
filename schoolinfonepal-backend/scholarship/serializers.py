from rest_framework import serializers
from .models import Scholarship
from school.models import School
from university.models import University
from course.models import Course
from level.models import Level
from django.utils.text import slugify

# Minimal serializers for nested read
class CourseMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']

class UniversityMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

class LevelMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'title']

class SchoolMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

class ScholarshipSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    
    # For reading, show nested; for writing, accept PK
    organizer_school = SchoolMinimalSerializer(read_only=True)
    organizer_school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), source='organizer_school', write_only=True, required=False, allow_null=True
    )
    organizer_university = UniversityMinimalSerializer(read_only=True)
    organizer_university_id = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), source='organizer_university', write_only=True, required=False, allow_null=True
    )
    
    courses = CourseMinimalSerializer(many=True, read_only=True)
    course_ids = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), many=True, source='courses', write_only=True, required=False
    )
    
    level = LevelMinimalSerializer(read_only=True)
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), source='level', write_only=True, required=False, allow_null=True
    )
    
    university = UniversityMinimalSerializer(read_only=True)
    university_id = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), source='university', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'organizer_school', 'organizer_school_id',
            'organizer_university', 'organizer_university_id',
            'organizer_custom',
            'courses', 'course_ids',
            'level', 'level_id',
            'university', 'university_id',
            'description', 'attachment',
            'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        print("=== SERIALIZER VALIDATION DEBUG ===")
        print(f"Received attrs: {attrs}")
        
        # ✅ FIXED: Check for organizer presence more carefully
        organizer_school = attrs.get('organizer_school')
        organizer_university = attrs.get('organizer_university') 
        organizer_custom = attrs.get('organizer_custom', '').strip()
        
        print(f"organizer_school: {organizer_school}")
        print(f"organizer_university: {organizer_university}")
        print(f"organizer_custom: '{organizer_custom}'")
        
        has_organizer = bool(organizer_school or organizer_university or organizer_custom)
        print(f"has_organizer: {has_organizer}")
        
        if not has_organizer:
            raise serializers.ValidationError({
                'non_field_errors': ["Please specify at least one organizer: school, university, or custom text."]
            })

        # Validate date range
        active_from = attrs.get('active_from')
        active_until = attrs.get('active_until')

        if active_from and active_until and active_from >= active_until:
            raise serializers.ValidationError({
                'active_until': ["Active until date must be after active from date."]
            })

        return attrs

    def create(self, validated_data):
        courses = validated_data.pop('courses', [])
        
        print("=== SERIALIZER CREATE DEBUG ===")
        print(f"Creating with validated_data: {validated_data}")
        print(f"Courses: {courses}")
        
        # Generate unique slug
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "scholarship"))
        slug = base_slug
        counter = 1
        while Scholarship.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        instance = Scholarship.objects.create(**validated_data)
        instance.courses.set(courses)
        
        print(f"Created scholarship: {instance.id}")
        return instance

    def update(self, instance, validated_data):
        courses = validated_data.pop('courses', None)
        
        print("=== SERIALIZER UPDATE DEBUG ===")
        print(f"Updating with validated_data: {validated_data}")
        print(f"Courses: {courses}")
        
        # Remove slug from validated_data to prevent updates
        validated_data.pop("slug", None)
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update courses if provided
        if courses is not None:
            instance.courses.set(courses)
            
        print(f"Updated scholarship: {instance.id}")
        return instance
