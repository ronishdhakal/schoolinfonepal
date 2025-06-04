from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    create_course,
    update_course,
    delete_course,
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),                         # /api/courses/
    path('create/', create_course, name='course-create'),                           # /api/courses/create/
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),         # /api/courses/<slug>/
    path('<slug:slug>/update/', update_course, name='course-update'),               # /api/courses/<slug>/update/
    path('<slug:slug>/delete/', delete_course, name='course-delete'),               # /api/courses/<slug>/delete/
]
