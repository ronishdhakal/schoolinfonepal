from rest_framework import serializers
from .models import Type

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']
