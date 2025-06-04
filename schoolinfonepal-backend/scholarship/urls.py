from django.urls import path
from .views import (
    ScholarshipListView,
    ScholarshipDetailView,
    ScholarshipCreateView,
    ScholarshipUpdateView,
    ScholarshipDeleteView,
)

urlpatterns = [
    path('', ScholarshipListView.as_view(), name='scholarship-list'),                         # GET /api/scholarships/
    path('create/', ScholarshipCreateView.as_view(), name='scholarship-create'),              # POST /api/scholarships/create/
    path('<slug:slug>/', ScholarshipDetailView.as_view(), name='scholarship-detail'),         # GET /api/scholarships/<slug>/
    path('<slug:slug>/update/', ScholarshipUpdateView.as_view(), name='scholarship-update'),  # PUT/PATCH /api/scholarships/<slug>/update/
    path('<slug:slug>/delete/', ScholarshipDeleteView.as_view(), name='scholarship-delete'),  # DELETE /api/scholarships/<slug>/delete/
]
