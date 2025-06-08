import json
from rest_framework import serializers
from .models import University, UniversityPhone, UniversityEmail, UniversityGallery
from type.models import Type

# --- Minimal Serializers ---
from course.models import Course
from school.models import School

class CourseMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'slug', 'duration', 'level']

class SchoolMinimalSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='district.name', read_only=True)

    class Meta:
        model = School
        fields = [
            'id', 'name', 'slug', 'logo', 'cover_photo',
            'address', 'district', 'district_name', 'verification'
        ]

class UniversityPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityPhone
        fields = ['id', 'phone']

class UniversityEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityEmail
        fields = ['id', 'email']

class UniversityGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityGallery
        fields = ['id', 'image', 'caption']

class UniversitySerializer(serializers.ModelSerializer):
    phones = UniversityPhoneSerializer(many=True, required=False, read_only=True)
    emails = UniversityEmailSerializer(many=True, required=False, read_only=True)
    gallery = UniversityGallerySerializer(many=True, required=False, read_only=True)

    type = serializers.PrimaryKeyRelatedField(
        queryset=Type.objects.all(),
        required=False,
        allow_null=True
    )
    type_name = serializers.CharField(source='type.name', read_only=True)

    # --- ADD THESE FIELDS ---
    courses = serializers.SerializerMethodField()
    schools = serializers.SerializerMethodField()

    class Meta:
        model = University
        fields = [
            'id', 'name', 'slug', 'address', 'cover_photo', 'logo', 'established_date',
            'type', 'type_name', 'website', 'location', 'gallery', 'phones', 'emails',
            'salient_features', 'about', 'priority',
            'meta_title', 'meta_description',
            'og_image', 'og_title', 'og_description',
            'is_verified', 'foreign_affiliated',
            'created_at', 'updated_at', 'status',
            'courses', 'schools',   # <-- new fields!
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    # ----------- Courses and Schools ----------
    def get_courses(self, obj):
        # Assumes: Course model has university = ForeignKey(University)
        from course.models import Course  # avoid circular import
        courses = Course.objects.filter(university=obj)
        return CourseMinimalSerializer(courses, many=True).data

    def get_schools(self, obj):
        # Assumes: School model has universities = ManyToManyField(University, related_name="schools")
        from school.models import School  # avoid circular import
        schools = obj.schools.all()
        return SchoolMinimalSerializer(schools, many=True).data

    # ----- (keep your safe_json_loads, create, update logic below) -----
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

        phones_data = self.safe_json_loads(raw_data.get("phones"), [])
        emails_data = self.safe_json_loads(raw_data.get("emails"), [])

        university = University.objects.create(**validated_data)

        # Create related objects
        for phone in phones_data:
            if phone.get('phone'):
                UniversityPhone.objects.create(university=university, phone=phone['phone'])
        for email in emails_data:
            if email.get('email'):
                UniversityEmail.objects.create(university=university, email=email['email'])

        return university

    def update(self, instance, validated_data):
        request = self.context.get("request")
        raw_data = request.data if request else {}

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle phones - only if provided in request
        if "phones" in raw_data:
            phones_data = self.safe_json_loads(raw_data.get("phones"), [])
            instance.phones.all().delete()
            for phone in phones_data:
                if phone.get('phone'):
                    UniversityPhone.objects.create(university=instance, phone=phone['phone'])

        # Handle emails - only if provided in request
        if "emails" in raw_data:
            emails_data = self.safe_json_loads(raw_data.get("emails"), [])
            instance.emails.all().delete()
            for email in emails_data:
                if email.get('email'):
                    UniversityEmail.objects.create(university=instance, email=email['email'])

        # Handle gallery - only if provided in request
        if "gallery" in raw_data:
            gallery_data = self.safe_json_loads(raw_data.get("gallery"), [])
            # Only delete existing gallery items that don't have new images
            existing_images = []
            for item in gallery_data:
                if isinstance(item.get('image'), str) and item['image']:
                    existing_images.append(item['image'])

            # Remove gallery items not in the existing_images list
            for gallery_item in instance.gallery.all():
                if gallery_item.image.url not in existing_images:
                    gallery_item.image.delete(save=False)
                    gallery_item.delete()

        return instance
