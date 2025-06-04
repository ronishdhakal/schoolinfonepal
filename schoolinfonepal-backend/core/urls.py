from django.urls import path
from .views import GlobalSearchAPIView

urlpatterns = [
    path('search/', GlobalSearchAPIView.as_view(), name='global-search'),
]
