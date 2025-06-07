from rest_framework import serializers
from .models import Inquiry, PreRegistrationInquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

class PreRegistrationInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = PreRegistrationInquiry
        fields = '__all__'
