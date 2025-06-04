from django.urls import path
from .views import (
    AdmissionListView,
    AdmissionDetailView,
    create_admission,
    update_admission,
    delete_admission,
)

urlpatterns = [
    path('', AdmissionListView.as_view(), name='admission-list'),                          # GET /api/admissions/
    path('create/', create_admission, name='admission-create'),                            # POST /api/admissions/create/
    path('<slug:slug>/', AdmissionDetailView.as_view(), name='admission-detail'),          # GET /api/admissions/<slug>/
    path('<slug:slug>/update/', update_admission, name='admission-update'),                # PATCH /api/admissions/<slug>/update/
    path('<slug:slug>/delete/', delete_admission, name='admission-delete'),                # DELETE /api/admissions/<slug>/delete/
]
