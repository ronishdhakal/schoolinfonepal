from django.contrib import admin
from .models import Level

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    search_fields = ('title',)
    prepopulated_fields = {"slug": ("title",)}
