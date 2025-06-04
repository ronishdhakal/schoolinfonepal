from django.urls import path
from .views import (
    FacilityListView,
    FacilityCreateView,
    FacilityDetailView,
    FacilityUpdateView,
    FacilityDeleteView,
)

urlpatterns = [
    path('', FacilityListView.as_view(), name='facility-list'),                          # /api/facilities/
    path('create/', FacilityCreateView.as_view(), name='facility-create'),               # /api/facilities/create/
    path('<slug:slug>/', FacilityDetailView.as_view(), name='facility-detail'),          # /api/facilities/<slug>/
    path('<slug:slug>/update/', FacilityUpdateView.as_view(), name='facility-update'),   # /api/facilities/<slug>/update/
    path('<slug:slug>/delete/', FacilityDeleteView.as_view(), name='facility-delete'),   # /api/facilities/<slug>/delete/
]
