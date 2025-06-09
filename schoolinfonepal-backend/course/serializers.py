from rest_framework import serializers
from .models import Course, CourseAttachment
from university.models import University
from level.models import Level
from discipline.models import Discipline
from django.utils.text import slugify

# Minimal serializer for university (id, name)
class UniversityMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

# Minimal serializer for level (id, title)
class LevelMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'title']

# Minimal serializer for discipline (id, title)
class DisciplineMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ['id', 'title']

class CourseAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = CourseAttachment
        fields = ['id', 'file', 'description']

    def get_file(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if request and obj.file else None

class CourseSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)
    attachments = CourseAttachmentSerializer(many=True, required=False, read_only=True)
    
    # ✅ FIXED: Proper handling of disciplines with display
    disciplines = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Discipline.objects.all(), required=False
    )
    disciplines_display = DisciplineMinimalSerializer(
        source='disciplines', many=True, read_only=True
    )

    # ✅ FIXED: Output nested objects for display
    university = UniversityMinimalSerializer(read_only=True)
    level = LevelMinimalSerializer(read_only=True)
    
    # ✅ FIXED: Input fields with proper validation
    university_id = serializers.PrimaryKeyRelatedField(
        queryset=University.objects.all(), 
        source='university', 
        write_only=True, 
        required=True,  # ✅ FIXED: Make this required since model requires it
        error_messages={
            'required': 'University is required.',
            'does_not_exist': 'Selected university does not exist.'
        }
    )
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), 
        source='level', 
        write_only=True, 
        required=False, 
        allow_null=True
    )

    # ✅ FIXED: Add og_image handling
    og_image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'abbreviation', 'slug',
            'university', 'university_id',        
            'duration', 'level', 'level_id',      
            'disciplines', 'disciplines_display',
            'short_description', 'long_description',
            'outcome', 'eligibility', 'curriculum',
            'attachments',
            'meta_title', 'meta_description',
            'og_title', 'og_description', 'og_image',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'university', 'level']

    def get_og_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.og_image.url) if request and obj.og_image else None

    def to_representation(self, instance):
        """Custom representation to include nested objects for frontend"""
        data = super().to_representation(instance)
        
        # ✅ FIXED: Include university and level objects for easier frontend handling
        if instance.university:
            data['university'] = {
                'id': instance.university.id,
                'name': instance.university.name
            }
        
        if instance.level:
            data['level'] = {
                'id': instance.level.id,
                'title': instance.level.title
            }
        
        return data

    def create(self, validated_data):
        disciplines_data = validated_data.pop('disciplines', [])
        
        # ✅ FIXED: Ensure university is present
        if not validated_data.get('university'):
            raise serializers.ValidationError({'university_id': 'University is required.'})
        
        # Generate slug
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("name", "course"))
        slug = base_slug
        counter = 1
        while Course.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        print(f"Creating course with data: {validated_data}")
        print(f"University: {validated_data.get('university')}")
        print(f"Level: {validated_data.get('level')}")
        print(f"Disciplines: {disciplines_data}")

        course = Course.objects.create(**validated_data)
        course.disciplines.set(disciplines_data)
        
        print(f"Created course: ID={course.id}, University={course.university}, Level={course.level}")
        return course

    def update(self, instance, validated_data):
        disciplines_data = validated_data.pop('disciplines', None)
        validated_data.pop("slug", None)  # Don't allow slug changes
        
        print(f"Updating course {instance.id} with data: {validated_data}")
        print(f"University: {validated_data.get('university')}")
        print(f"Level: {validated_data.get('level')}")
        print(f"Disciplines: {disciplines_data}")
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            print(f"Set {attr} = {value}")
        
        instance.save()
        print(f"Saved course: University={instance.university}, Level={instance.level}")
        
        if disciplines_data is not None:
            instance.disciplines.set(disciplines_data)
            print(f"Updated disciplines: {[d.title for d in instance.disciplines.all()]}")
        
        return instance
