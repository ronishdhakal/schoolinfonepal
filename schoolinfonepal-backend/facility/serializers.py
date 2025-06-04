from rest_framework import serializers
from .models import Facility
from django.utils.text import slugify

class FacilitySerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Facility
        fields = ['id', 'name', 'slug', 'icon']
        read_only_fields = ['id']

    def create(self, validated_data):
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("name", "facility"))
        slug = base_slug
        counter = 1
        while Facility.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug
        return Facility.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("slug", None)  # prevent slug change
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
