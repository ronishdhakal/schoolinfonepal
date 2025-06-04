from django.urls import path
from .views import (
    AdmissionListView,
    AdmissionDetailView,
    AdmissionCreateView,
    AdmissionUpdateView,
    AdmissionDeleteView,
)

urlpatterns = [
    path('', AdmissionListView.as_view(), name='admission-list'),                         # GET /api/admissions/
    path('create/', AdmissionCreateView.as_view(), name='admission-create'),              # POST /api/admissions/create/
    path('<slug:slug>/', AdmissionDetailView.as_view(), name='admission-detail'),         # GET /api/admissions/<slug>/
    path('<slug:slug>/update/', AdmissionUpdateView.as_view(), name='admission-update'),  # PUT/PATCH /api/admissions/<slug>/update/
    path('<slug:slug>/delete/', AdmissionDeleteView.as_view(), name='admission-delete'),  # DELETE /api/admissions/<slug>/delete/
]
