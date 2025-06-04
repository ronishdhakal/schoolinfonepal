from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import School
from .serializers import SchoolSerializer
from core.filters import SchoolFilter

# Public: List all schools with search + filter support
class SchoolListView(generics.ListAPIView):
    queryset = School.objects.all().order_by('-priority', 'name')
    serializer_class = SchoolSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SchoolFilter
    search_fields = [
        'title', 'address', 'district__name', 'courses__name',
        'universities__name', 'levels__name'
    ]

# Admin: Create a new school
class SchoolCreateView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAdminUser]

# Public: Get detail for a school by slug
class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# Admin: Update school (by slug)
class SchoolUpdateView(generics.UpdateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Admin: Delete school (by slug)
class SchoolDeleteView(generics.DestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# School dashboard: Retrieve own profile
class SchoolOwnDetailView(generics.RetrieveAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.school

# School dashboard: Update own profile
class SchoolOwnUpdateView(generics.UpdateAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.school
