from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Information
from .serializers import InformationSerializer
from core.filters import InformationFilter

# Public: List all information items with search + filter
class InformationListView(generics.ListAPIView):
    queryset = Information.objects.all().order_by('-published_date', '-created_at')
    serializer_class = InformationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InformationFilter
    search_fields = ['title', 'top_description', 'below_description']

# Public: Retrieve a single info by slug
class InformationDetailView(generics.RetrieveAPIView):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Admin: Create new info item
class InformationCreateView(generics.CreateAPIView):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.IsAdminUser]

# Admin: Update info by slug
class InformationUpdateView(generics.UpdateAPIView):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Admin: Delete info by slug
class InformationDeleteView(generics.DestroyAPIView):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
