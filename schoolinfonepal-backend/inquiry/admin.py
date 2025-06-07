from django.contrib import admin
from .models import Inquiry, PreRegistrationInquiry

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'school', 'course', 'created_at')
    search_fields = ('full_name', 'phone', 'email', 'message')
    list_filter = ('school', 'course')
    readonly_fields = ('created_at',)

@admin.register(PreRegistrationInquiry)
class PreRegistrationInquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'school', 'level', 'created_at')
    search_fields = ('full_name', 'phone', 'email', 'message', 'level')
    list_filter = ('school',)
    readonly_fields = ('created_at',)
