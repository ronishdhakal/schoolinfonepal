from django.urls import path
from .views import (
    AdvertisementListView,
    AdvertisementCreateView,
    AdvertisementDetailView,
    AdvertisementUpdateView,
    AdvertisementDeleteView,
)

urlpatterns = [
    path('', AdvertisementListView.as_view(), name='advertisement-list'),                         # GET /api/ads/
    path('create/', AdvertisementCreateView.as_view(), name='advertisement-create'),              # POST /api/ads/create/
    path('<int:id>/', AdvertisementDetailView.as_view(), name='advertisement-detail'),            # GET /api/ads/<id>/
    path('<int:id>/update/', AdvertisementUpdateView.as_view(), name='advertisement-update'),     # PUT/PATCH /api/ads/<id>/update/
    path('<int:id>/delete/', AdvertisementDeleteView.as_view(), name='advertisement-delete'),     # DELETE /api/ads/<id>/delete/
]
