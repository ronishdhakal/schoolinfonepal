from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Admission
from .serializers import AdmissionSerializer
from core.filters import AdmissionFilter

# Public: List all admissions with search + filter
class AdmissionListView(generics.ListAPIView):
    queryset = Admission.objects.all().order_by('-published_date', '-created_at')
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AdmissionFilter
    search_fields = ['title', 'school__name', 'university__name']

# Public: Retrieve admission detail by slug
class AdmissionDetailView(generics.RetrieveAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Admin: Create a new admission
class AdmissionCreateView(generics.CreateAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.IsAdminUser]

# Admin: Update admission by slug
class AdmissionUpdateView(generics.UpdateAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Admin: Delete admission by slug
class AdmissionDeleteView(generics.DestroyAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
