from django.contrib import admin
from .models import Type

@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}
