from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import University
from .serializers import UniversitySerializer
from core.filters import UniversityFilter

# Public: List all universities with filter + search
class UniversityListView(generics.ListAPIView):
    queryset = University.objects.all().order_by('priority', 'name')
    serializer_class = UniversitySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = UniversityFilter
    search_fields = ['name']

# Admin: Create a new university
class UniversityCreateView(generics.CreateAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.IsAdminUser]

# Public: Get detail for a university by slug
class UniversityDetailView(generics.RetrieveAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Admin: Update university (by slug)
class UniversityUpdateView(generics.UpdateAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Admin: Delete university (by slug)
class UniversityDeleteView(generics.DestroyAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
