from django.urls import path
from .views import (
    AdvertisementListView,
    AdvertisementAdminListView,
    create_advertisement,
    update_advertisement,
    delete_advertisement,
    AdvertisementDetailView,
)

urlpatterns = [
    path('', AdvertisementListView.as_view(), name='advertisement-list'),                         # GET /api/ads/ (public - active only)
    path('admin/', AdvertisementAdminListView.as_view(), name='advertisement-admin-list'),        # GET /api/ads/admin/ (admin - all)
    path('create/', create_advertisement, name='advertisement-create'),                           # POST /api/ads/create/
    path('<int:id>/', AdvertisementDetailView.as_view(), name='advertisement-detail'),            # GET /api/ads/<id>/
    path('<int:id>/update/', update_advertisement, name='advertisement-update'),                  # PUT/PATCH /api/ads/<id>/update/
    path('<int:id>/delete/', delete_advertisement, name='advertisement-delete'),                  # DELETE /api/ads/<id>/delete/
]
