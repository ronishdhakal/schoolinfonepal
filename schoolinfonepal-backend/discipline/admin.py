from django.contrib import admin
from .models import Discipline

@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    search_fields = ('title',)
    prepopulated_fields = {"slug": ("title",)}
