from django.urls import path
from .views import (
    DistrictListView,
    DistrictCreateView,
    DistrictDetailView,
    DistrictUpdateView,
    DistrictDeleteView,
)

urlpatterns = [
    path('', DistrictListView.as_view(), name='district-list'),                           # /api/districts/
    path('create/', DistrictCreateView.as_view(), name='district-create'),                # /api/districts/create/
    path('<slug:slug>/', DistrictDetailView.as_view(), name='district-detail'),           # /api/districts/<slug>/
    path('<slug:slug>/update/', DistrictUpdateView.as_view(), name='district-update'),    # /api/districts/<slug>/update/
    path('<slug:slug>/delete/', DistrictDeleteView.as_view(), name='district-delete'),    # /api/districts/<slug>/delete/
]
