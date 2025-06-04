from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Scholarship
from .serializers import ScholarshipSerializer
from core.filters import ScholarshipFilter

# Public: List all scholarships with search + filter
class ScholarshipListView(generics.ListAPIView):
    queryset = Scholarship.objects.all().order_by('-published_date', '-created_at')
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ScholarshipFilter
    search_fields = [
        'title', 'organizer_custom',
        'organizer_school__name', 'organizer_university__name'
    ]

# Public: Retrieve a single scholarship by slug
class ScholarshipDetailView(generics.RetrieveAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Admin: Create scholarship
class ScholarshipCreateView(generics.CreateAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAdminUser]

# Admin: Update scholarship by slug
class ScholarshipUpdateView(generics.UpdateAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Admin: Delete scholarship by slug
class ScholarshipDeleteView(generics.DestroyAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
