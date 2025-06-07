from django.urls import path
from .views import (
    InquiryListCreateView, 
    PreRegistrationInquiryListCreateView,
    AdminInquiryListView,
    AdminPreRegistrationInquiryListView,
    admin_inquiry_analytics,
    export_inquiries_csv
)

urlpatterns = [
    # Public endpoints
    path('inquiries/', InquiryListCreateView.as_view(), name='inquiry-list-create'),
    path('pre-registration/', PreRegistrationInquiryListCreateView.as_view(), name='pre-registration-list-create'),
    
    # Admin endpoints
    path('admin/inquiries/', AdminInquiryListView.as_view(), name='admin-inquiry-list'),
    path('admin/pre-registrations/', AdminPreRegistrationInquiryListView.as_view(), name='admin-pre-registration-list'),
    path('admin/analytics/', admin_inquiry_analytics, name='admin-inquiry-analytics'),
    path('admin/export/', export_inquiries_csv, name='admin-inquiry-export'),
]
