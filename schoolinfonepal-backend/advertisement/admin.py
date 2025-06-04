from django.contrib import admin
from .models import Advertisement

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'placement', 'is_active', 'created_at')
    list_filter = ('placement', 'is_active')
    search_fields = ('title', 'link')
    ordering = ('-created_at',)
