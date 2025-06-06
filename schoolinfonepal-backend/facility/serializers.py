from rest_framework import serializers
from django.utils.text import slugify
from .models import Facility

class FacilitySerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Facility
        fields = [
            'id', 'name', 'slug', 'icon', 'description',
            'meta_title', 'meta_description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Create unique slug
        base_slug = slugify(validated_data.get("slug") or validated_data.get("name", "facility"))
        slug = base_slug
        counter = 1
        while Facility.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug

        return Facility.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Don't update slug
        validated_data.pop("slug", None)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class FacilityDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'slug']
