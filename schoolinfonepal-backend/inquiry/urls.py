from django.urls import path
from .views import InquiryListCreateView, PreRegistrationInquiryListCreateView

urlpatterns = [
    path('inquiries/', InquiryListCreateView.as_view(), name='inquiry-list-create'),
    path('pre-registration/', PreRegistrationInquiryListCreateView.as_view(), name='pre-registration-list-create'),
]
