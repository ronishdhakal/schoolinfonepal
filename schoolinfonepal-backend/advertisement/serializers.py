from rest_framework import serializers
from .models import Advertisement
from django.utils.text import slugify

class AdvertisementSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'slug', 'link', 'placement',
            'image_mobile', 'image_desktop',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "advertisement"))
        slug = base_slug
        counter = 1
        while Advertisement.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug
        return Advertisement.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("slug", None)  # Don't allow slug update
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
