from django.urls import path
from .views import (
    UniversityListView,
    UniversityCreateView,
    UniversityDetailView,
    UniversityUpdateView,
    UniversityDeleteView,
)

urlpatterns = [
    path('', UniversityListView.as_view(), name='university-list'),                              # /api/universities/
    path('create/', UniversityCreateView.as_view(), name='university-create'),                   # /api/universities/create/
    path('<slug:slug>/', UniversityDetailView.as_view(), name='university-detail'),              # /api/universities/<slug>/
    path('<slug:slug>/update/', UniversityUpdateView.as_view(), name='university-update'),       # /api/universities/<slug>/update/
    path('<slug:slug>/delete/', UniversityDeleteView.as_view(), name='university-delete'),       # /api/universities/<slug>/delete/
]
