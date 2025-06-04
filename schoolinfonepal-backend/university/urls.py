from django.urls import path
from .views import (
    university_list,
    university_detail,
    university_create,
    university_update,
    university_delete
)

urlpatterns = [
    path('', university_list, name='university-list'),
    path('create/', university_create, name='university-create'),
    path('<slug:slug>/', university_detail, name='university-detail'),
    path('<slug:slug>/update/', university_update, name='university-update'),
    path('<slug:slug>/delete/', university_delete, name='university-delete'),
]
