from django.urls import path
from .views import type_list, type_detail, type_create, type_update, type_delete, type_dropdown

urlpatterns = [
    path('', type_list, name='type-list'),
    path('create/', type_create, name='type-create'),
    path("dropdown/", type_dropdown),

    path('<slug:slug>/', type_detail, name='type-detail'),
    path('<slug:slug>/update/', type_update, name='type-update'),
    path('<slug:slug>/delete/', type_delete, name='type-delete'),
]
