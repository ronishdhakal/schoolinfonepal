from django.contrib import admin
from .models import Facility

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)
