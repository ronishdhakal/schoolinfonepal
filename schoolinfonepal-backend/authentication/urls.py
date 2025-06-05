from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
]
