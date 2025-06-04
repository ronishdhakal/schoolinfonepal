from django.urls import path
from .views import (
    InformationListView,
    InformationDetailView,
    create_information,
    update_information,
    delete_information,
)

urlpatterns = [
    path('', InformationListView.as_view(), name='information-list'),                           # GET /api/information/
    path('create/', create_information, name='information-create'),                             # POST /api/information/create/
    path('<slug:slug>/', InformationDetailView.as_view(), name='information-detail'),           # GET /api/information/<slug>/
    path('<slug:slug>/update/', update_information, name='information-update'),                 # PATCH /api/information/<slug>/update/
    path('<slug:slug>/delete/', delete_information, name='information-delete'),                 # DELETE /api/information/<slug>/delete/
]
