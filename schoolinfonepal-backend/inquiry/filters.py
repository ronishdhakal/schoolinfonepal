from django_filters import rest_framework as filters
from .models import Inquiry, PreRegistrationInquiry

class InquiryFilter(filters.FilterSet):
    school_name = filters.CharFilter(field_name='school__name', lookup_expr='icontains')
    course_name = filters.CharFilter(field_name='course__name', lookup_expr='icontains')
    name = filters.CharFilter(field_name='full_name', lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    phone = filters.CharFilter(lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Inquiry
        fields = ['school', 'course', 'start_date', 'end_date', 'school_name', 'course_name', 'name', 'email', 'phone']

class PreRegistrationInquiryFilter(filters.FilterSet):
    school_name = filters.CharFilter(field_name='school__name', lookup_expr='icontains')
    course_name = filters.CharFilter(field_name='course__name', lookup_expr='icontains')
    name = filters.CharFilter(field_name='full_name', lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    phone = filters.CharFilter(lookup_expr='icontains')
    level = filters.CharFilter(lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = PreRegistrationInquiry
        fields = ['school', 'course', 'level', 'start_date', 'end_date', 'school_name', 'course_name', 'name', 'email', 'phone']
