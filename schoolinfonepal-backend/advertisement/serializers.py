from rest_framework import serializers
from .models import Advertisement

class AdvertisementSerializer(serializers.ModelSerializer):
    # ✅ FIXED: Add SerializerMethodField for proper image URL handling
    image_mobile = serializers.SerializerMethodField()
    image_desktop = serializers.SerializerMethodField()
    
    # ✅ FIXED: Add write-only fields for file uploads
    image_mobile_file = serializers.ImageField(write_only=True, required=False)
    image_desktop_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'link', 'placement',
            'image_mobile', 'image_desktop',
            'image_mobile_file', 'image_desktop_file',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_image_mobile(self, obj):
        request = self.context.get('request')
        if obj.image_mobile:
            return request.build_absolute_uri(obj.image_mobile.url) if request else obj.image_mobile.url
        return None

    def get_image_desktop(self, obj):
        request = self.context.get('request')
        if obj.image_desktop:
            return request.build_absolute_uri(obj.image_desktop.url) if request else obj.image_desktop.url
        return None

    def create(self, validated_data):
        # Handle file uploads
        image_mobile_file = validated_data.pop('image_mobile_file', None)
        image_desktop_file = validated_data.pop('image_desktop_file', None)
        
        # Handle direct file uploads (from FormData)
        if 'image_mobile' in validated_data and hasattr(validated_data['image_mobile'], 'read'):
            # This is a file object
            pass
        elif image_mobile_file:
            validated_data['image_mobile'] = image_mobile_file
            
        if 'image_desktop' in validated_data and hasattr(validated_data['image_desktop'], 'read'):
            # This is a file object
            pass
        elif image_desktop_file:
            validated_data['image_desktop'] = image_desktop_file

        print(f"Creating advertisement with data: {validated_data}")
        return Advertisement.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Handle file uploads
        image_mobile_file = validated_data.pop('image_mobile_file', None)
        image_desktop_file = validated_data.pop('image_desktop_file', None)
        
        # Handle direct file uploads (from FormData)
        if 'image_mobile' in validated_data and hasattr(validated_data['image_mobile'], 'read'):
            # This is a file object
            pass
        elif image_mobile_file:
            validated_data['image_mobile'] = image_mobile_file
            
        if 'image_desktop' in validated_data and hasattr(validated_data['image_desktop'], 'read'):
            # This is a file object
            pass
        elif image_desktop_file:
            validated_data['image_desktop'] = image_desktop_file

        print(f"Updating advertisement with data: {validated_data}")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
