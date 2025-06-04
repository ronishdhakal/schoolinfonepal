from django.urls import path
from .views import (
    InformationListView,
    InformationDetailView,
    InformationCreateView,
    InformationUpdateView,
    InformationDeleteView,
)

urlpatterns = [
    path('', InformationListView.as_view(), name='information-list'),                          # GET /api/information/
    path('create/', InformationCreateView.as_view(), name='information-create'),               # POST /api/information/create/
    path('<slug:slug>/', InformationDetailView.as_view(), name='information-detail'),          # GET /api/information/<slug>/
    path('<slug:slug>/update/', InformationUpdateView.as_view(), name='information-update'),   # PUT/PATCH /api/information/<slug>/update/
    path('<slug:slug>/delete/', InformationDeleteView.as_view(), name='information-delete'),   # DELETE /api/information/<slug>/delete/
]
