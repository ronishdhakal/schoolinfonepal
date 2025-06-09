from rest_framework import serializers
from .models import Admission
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University
from django.utils.text import slugify

class SchoolMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name']

class CourseMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'duration']

class LevelMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'title']

class UniversityMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

class AdmissionSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    # For read: show school as nested object
    school = SchoolMinimalSerializer(read_only=True)
    # For write: allow ID input
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), 
        write_only=True, 
        required=False, 
        allow_null=True
    )

    # For read: show full course info
    courses = CourseMinimalSerializer(many=True, read_only=True)
    # For write: allow course IDs
    course_ids = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), 
        many=True, 
        write_only=True, 
        required=False
    )

    # ✅ FIXED: Proper handling of level and university
    level_display = LevelMinimalSerializer(source='level', read_only=True)
    university_display = UniversityMinimalSerializer(source='university', read_only=True)
    
    level = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), 
        required=False, 
        allow_null=True
    )
    university = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), 
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Admission
        fields = [
            'id', 'title', 'slug', 'published_date',
            'active_from', 'active_until',
            'school', 'school_id',
            'courses', 'course_ids',
            'level', 'level_display', 'university', 'university_display',
            'featured', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def to_representation(self, instance):
        """Custom representation to include level and university objects for frontend"""
        data = super().to_representation(instance)
        
        # ✅ FIXED: Include level and university objects for easier frontend handling
        if instance.level:
            data['level'] = {
                'id': instance.level.id,
                'title': instance.level.title
            }
        else:
            data['level'] = None
        
        if instance.university:
            data['university'] = {
                'id': instance.university.id,
                'name': instance.university.name
            }
        else:
            data['university'] = None
        
        print(f"Serialized admission {instance.id}: level={data['level']}, university={data['university']}")
        return data

    def create(self, validated_data):
        # Extract course and school IDs
        course_ids = validated_data.pop('course_ids', [])
        school_obj = validated_data.pop('school_id', None)
        
        # Generate slug
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "admission"))
        slug = base_slug
        counter = 1
        while Admission.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        if school_obj:
            validated_data["school"] = school_obj

        print(f"Creating admission with data: {validated_data}")
        print(f"Course IDs: {course_ids}")
        print(f"Level: {validated_data.get('level')}")
        print(f"University: {validated_data.get('university')}")

        admission = Admission.objects.create(**validated_data)
        
        if course_ids:
            admission.courses.set(course_ids)
            print(f"Set courses: {[c.name for c in admission.courses.all()]}")
        
        print(f"Created admission: ID={admission.id}, Level={admission.level}, University={admission.university}")
        return admission

    def update(self, instance, validated_data):
        course_ids = validated_data.pop('course_ids', None)
        school_obj = validated_data.pop('school_id', None)
        validated_data.pop("slug", None)  # Don't allow slug change

        print(f"Updating admission {instance.id} with data: {validated_data}")
        print(f"Course IDs: {course_ids}")
        print(f"Level: {validated_data.get('level')}")
        print(f"University: {validated_data.get('university')}")

        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            print(f"Set {attr} = {value}")
        
        if school_obj is not None:
            instance.school = school_obj
            print(f"Set school = {school_obj}")
        
        instance.save()
        print(f"Saved admission: Level={instance.level}, University={instance.university}")

        # Update courses
        if course_ids is not None:
            instance.courses.set(course_ids)
            print(f"Updated courses: {[c.name for c in instance.courses.all()]}")

        return instance
