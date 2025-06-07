from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Inquiry, PreRegistrationInquiry
from .serializers import InquirySerializer, PreRegistrationInquirySerializer

# List & Create Inquiry
class InquiryListCreateView(generics.ListCreateAPIView):
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [permissions.AllowAny]

# List & Create Pre-Registration Inquiry
class PreRegistrationInquiryListCreateView(generics.ListCreateAPIView):
    queryset = PreRegistrationInquiry.objects.all().order_by('-created_at')
    serializer_class = PreRegistrationInquirySerializer
    permission_classes = [permissions.AllowAny]
