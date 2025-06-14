from django.shortcuts import render
from django.db.models import Count, Q
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
import csv
import datetime
from collections import defaultdict

from .models import Inquiry, PreRegistrationInquiry
from .serializers import InquirySerializer, PreRegistrationInquirySerializer
from .filters import InquiryFilter, PreRegistrationInquiryFilter
from core.pagination import StandardResultsSetPagination

# Public endpoints - List & Create Inquiry
class InquiryListCreateView(generics.ListCreateAPIView):
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

# Public endpoints - List & Create Pre-Registration Inquiry
class PreRegistrationInquiryListCreateView(generics.ListCreateAPIView):
    queryset = PreRegistrationInquiry.objects.all().order_by('-created_at')
    serializer_class = PreRegistrationInquirySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

# Admin endpoints - List all inquiries with filters
class AdminInquiryListView(generics.ListAPIView):
    queryset = Inquiry.objects.all().select_related('school', 'course').order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InquiryFilter
    search_fields = ['full_name', 'email', 'phone', 'school__name', 'course__name']
    ordering_fields = ['created_at', 'full_name', 'school__name', 'course__name']
    pagination_class = StandardResultsSetPagination

# Admin endpoints - List all pre-registration inquiries with filters
class AdminPreRegistrationInquiryListView(generics.ListAPIView):
    queryset = PreRegistrationInquiry.objects.all().select_related('school', 'course').order_by('-created_at')
    serializer_class = PreRegistrationInquirySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PreRegistrationInquiryFilter
    search_fields = ['full_name', 'email', 'phone', 'school__name', 'course__name', 'level']
    ordering_fields = ['created_at', 'full_name', 'school__name', 'course__name']
    pagination_class = StandardResultsSetPagination

# Admin endpoint - Analytics for inquiries
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_inquiry_analytics(request):
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')

    start_date = None
    end_date = None

    if start_date_str:
        try:
            start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    if end_date_str:
        try:
            end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    inquiries_query = Inquiry.objects.all()
    pre_reg_query = PreRegistrationInquiry.objects.all()

    if start_date:
        inquiries_query = inquiries_query.filter(created_at__date__gte=start_date)
        pre_reg_query = pre_reg_query.filter(created_at__date__gte=start_date)

    if end_date:
        inquiries_query = inquiries_query.filter(created_at__date__lte=end_date)
        pre_reg_query = pre_reg_query.filter(created_at__date__lte=end_date)

    total_inquiries = inquiries_query.count()
    total_pre_registrations = pre_reg_query.count()

    top_schools_inquiries = inquiries_query.values('school__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    top_schools_pre_reg = pre_reg_query.values('school__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    top_courses_inquiries = inquiries_query.values('course__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    top_courses_pre_reg = pre_reg_query.values('course__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    today = datetime.date.today()
    last_week = today - datetime.timedelta(days=6)

    daily_inquiries = {}
    daily_pre_reg = {}

    for i in range(7):
        day = last_week + datetime.timedelta(days=i)
        day_str = day.strftime('%Y-%m-%d')

        daily_inquiries[day_str] = inquiries_query.filter(
            created_at__date=day
        ).count()

        daily_pre_reg[day_str] = pre_reg_query.filter(
            created_at__date=day
        ).count()

    return Response({
        'total_inquiries': total_inquiries,
        'total_pre_registrations': total_pre_registrations,
        'top_schools_inquiries': top_schools_inquiries,
        'top_schools_pre_registrations': top_schools_pre_reg,
        'top_courses_inquiries': top_courses_inquiries,
        'top_courses_pre_registrations': top_courses_pre_reg,
        'daily_trends': {
            'inquiries': daily_inquiries,
            'pre_registrations': daily_pre_reg
        }
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def export_inquiries_csv(request):
    inquiry_type = request.query_params.get('type', 'all')
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')

    start_date = None
    end_date = None

    if start_date_str:
        try:
            start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    if end_date_str:
        try:
            end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            pass

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="inquiries_export_{datetime.date.today()}.csv"'

    writer = csv.writer(response)

    if inquiry_type in ['all', 'inquiries']:
        inquiries = Inquiry.objects.all().select_related('school', 'course')

        if start_date:
            inquiries = inquiries.filter(created_at__date__gte=start_date)

        if end_date:
            inquiries = inquiries.filter(created_at__date__lte=end_date)

        writer.writerow(['Type', 'ID', 'Full Name', 'Email', 'Phone', 'Address', 'School', 'Course', 'Message', 'Created At'])

        for inquiry in inquiries:
            writer.writerow([
                'Regular Inquiry',
                inquiry.id,
                inquiry.full_name,
                inquiry.email,
                inquiry.phone,
                inquiry.address,
                inquiry.school.name if inquiry.school else 'N/A',
                inquiry.course.name if inquiry.course else 'N/A',
                inquiry.message,
                inquiry.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])

    if inquiry_type in ['all', 'pre_registrations']:
        pre_registrations = PreRegistrationInquiry.objects.all().select_related('school', 'course')

        if start_date:
            pre_registrations = pre_registrations.filter(created_at__date__gte=start_date)

        if end_date:
            pre_registrations = pre_registrations.filter(created_at__date__lte=end_date)

        if inquiry_type != 'all':
            writer.writerow(['Type', 'ID', 'Full Name', 'Email', 'Phone', 'Address', 'Level', 'School', 'Course', 'Message', 'Created At'])

        for pre_reg in pre_registrations:
            writer.writerow([
                'Pre-Registration',
                pre_reg.id,
                pre_reg.full_name,
                pre_reg.email,
                pre_reg.phone,
                pre_reg.address,
                pre_reg.level,
                pre_reg.school.name if pre_reg.school else 'N/A',
                pre_reg.course.name if pre_reg.course else 'N/A',
                pre_reg.message,
                pre_reg.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])

    return response
