from rest_framework import serializers
from .models import Discipline
from django.utils.text import slugify

class DisciplineSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Discipline
        fields = ['id', 'title', 'slug']
        read_only_fields = ['id']

    def create(self, validated_data):
        requested_slug = validated_data.get("slug")
        base_slug = slugify(requested_slug or validated_data.get("title", "discipline"))
        slug = base_slug
        counter = 1
        while Discipline.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        validated_data["slug"] = slug
        return Discipline.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("slug", None)  # Don't allow slug change
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
