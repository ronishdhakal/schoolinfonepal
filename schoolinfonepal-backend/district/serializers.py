from rest_framework import serializers
from .models import District

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']
