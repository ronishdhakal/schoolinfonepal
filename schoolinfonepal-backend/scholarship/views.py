from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
import json

from .models import Scholarship
from .serializers import ScholarshipSerializer
from core.filters import ScholarshipFilter

def safe_json_loads(val):
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

# ✅ Public: List with filter + search
class ScholarshipListView(ListAPIView):
    queryset = Scholarship.objects.all().order_by('-published_date', '-created_at')
    serializer_class = ScholarshipSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ScholarshipFilter
    search_fields = [
        'title', 'organizer_custom',
        'organizer_school__name', 'organizer_university__name',
        'university__name', 'level__name'
    ]
    ordering_fields = ['published_date', 'active_from', 'active_until', 'created_at']

# ✅ Public: Detail
class ScholarshipDetailView(RetrieveAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create Scholarship
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_scholarship(request):
    data = request.data.dict()
    data["courses"] = safe_json_loads(request.data.get("courses", []))

    serializer = ScholarshipSerializer(data=data)
    if serializer.is_valid():
        scholarship = serializer.save()
        return Response(ScholarshipSerializer(scholarship).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Scholarship
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_scholarship(request, slug):
    scholarship = get_object_or_404(Scholarship, slug=slug)
    data = request.data.dict()
    
    # Handle courses - only if explicitly provided
    if "courses" in request.data:
        data["courses"] = safe_json_loads(request.data.get("courses", []))
    
    # Don't include courses in serializer data if not provided
    serializer_data = {k: v for k, v in data.items() if k != 'courses' or 'courses' in request.data}
    
    serializer = ScholarshipSerializer(scholarship, data=serializer_data, partial=True)
    if serializer.is_valid():
        scholarship = serializer.save()
        return Response(ScholarshipSerializer(scholarship).data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Scholarship
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_scholarship(request, slug):
    scholarship = get_object_or_404(Scholarship, slug=slug)
    scholarship.delete()
    return Response({"message": "Scholarship deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# ✅ Dropdown for scholarships (if needed)
@api_view(['GET'])
@permission_classes([AllowAny])
def scholarship_dropdown(request):
    scholarships = Scholarship.objects.all().values('id', 'title')
    return Response(scholarships)
