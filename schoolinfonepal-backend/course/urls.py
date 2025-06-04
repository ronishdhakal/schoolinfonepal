from django.urls import path
from .views import (
    CourseListView,
    CourseCreateView,
    CourseDetailView,
    CourseUpdateView,
    CourseDeleteView,
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),                         # /api/courses/
    path('create/', CourseCreateView.as_view(), name='course-create'),              # /api/courses/create/
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),         # /api/courses/<slug>/
    path('<slug:slug>/update/', CourseUpdateView.as_view(), name='course-update'),  # /api/courses/<slug>/update/
    path('<slug:slug>/delete/', CourseDeleteView.as_view(), name='course-delete'),  # /api/courses/<slug>/delete/
]
