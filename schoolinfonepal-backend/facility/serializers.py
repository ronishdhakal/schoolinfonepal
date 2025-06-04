from rest_framework import serializers
from .models import Facility

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'slug', 'icon']
        read_only_fields = ['slug']
