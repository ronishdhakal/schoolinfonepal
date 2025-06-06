from django.urls import path
from .views import (
    # Information views
    InformationListView,
    InformationDetailView,
    create_information,
    update_information,
    delete_information,
    
    # Category views
    InformationCategoryListView,
    InformationCategoryDetailView,
    create_information_category,
    update_information_category,
    delete_information_category,
    information_category_dropdown,
)

urlpatterns = [
    # Information endpoints
    path('', InformationListView.as_view(), name='information-list'),
    path('create/', create_information, name='information-create'),
    path('<slug:slug>/', InformationDetailView.as_view(), name='information-detail'),
    path('<slug:slug>/update/', update_information, name='information-update'),
    path('<slug:slug>/delete/', delete_information, name='information-delete'),
    
    # Category endpoints
    path('categories/', InformationCategoryListView.as_view(), name='information-category-list'),
    path('categories/dropdown/', information_category_dropdown, name='information-category-dropdown'),
    path('categories/create/', create_information_category, name='information-category-create'),
    path('categories/<slug:slug>/', InformationCategoryDetailView.as_view(), name='information-category-detail'),
    path('categories/<slug:slug>/update/', update_information_category, name='information-category-update'),
    path('categories/<slug:slug>/delete/', delete_information_category, name='information-category-delete'),
]
