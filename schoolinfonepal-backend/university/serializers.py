from rest_framework import serializers
from .models import University, UniversityPhone, UniversityEmail, UniversityGallery
from type.models import Type

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
    phones = UniversityPhoneSerializer(many=True, required=False)
    emails = UniversityEmailSerializer(many=True, required=False)
    gallery = UniversityGallerySerializer(many=True, required=False)
    type = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Type.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = University
        fields = [
            'id', 'name', 'slug', 'address', 'cover_photo', 'logo', 'established_date',
            'type', 'website', 'location', 'gallery', 'phones', 'emails',
            'salient_features', 'about', 'priority',
            'meta_title', 'meta_description',
            'og_image', 'og_title', 'og_description',
            'is_verified', 'foreign_affiliated',   # <--- Added field here
            'created_at', 'updated_at', 'status',
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'is_verified']

    def create(self, validated_data):
        phones_data = validated_data.pop('phones', [])
        emails_data = validated_data.pop('emails', [])
        gallery_data = validated_data.pop('gallery', [])
        university = University.objects.create(**validated_data)

        for phone in phones_data:
            UniversityPhone.objects.create(university=university, **phone)
        for email in emails_data:
            UniversityEmail.objects.create(university=university, **email)
        for image in gallery_data:
            UniversityGallery.objects.create(university=university, **image)
        return university

    def update(self, instance, validated_data):
        phones_data = validated_data.pop('phones', [])
        emails_data = validated_data.pop('emails', [])
        gallery_data = validated_data.pop('gallery', [])

        # Update core fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Phones
        if phones_data:
            instance.phones.all().delete()
            for phone in phones_data:
                UniversityPhone.objects.create(university=instance, **phone)
        # Emails
        if emails_data:
            instance.emails.all().delete()
            for email in emails_data:
                UniversityEmail.objects.create(university=instance, **email)
        # Gallery
        if gallery_data:
            instance.gallery.all().delete()
            for image in gallery_data:
                UniversityGallery.objects.create(university=instance, **image)

        return instance
