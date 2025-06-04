from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.text import slugify
from django.shortcuts import get_object_or_404

from .models import Admission
from .serializers import AdmissionSerializer
from core.filters import AdmissionFilter
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University

# ✅ Utility
def safe_json_loads(val):
    import json
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

# ✅ Public: List all admissions
from rest_framework.generics import ListAPIView, RetrieveAPIView

class AdmissionListView(ListAPIView):
    queryset = Admission.objects.all().order_by('-published_date', '-created_at')
    serializer_class = AdmissionSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AdmissionFilter
    search_fields = ['title', 'school__name', 'university__name']

class AdmissionDetailView(RetrieveAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create Admission with support for FormData + JSON
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_admission(request):
    data = request.data.dict()

    data["courses"] = safe_json_loads(request.data.get("courses", []))

    serializer = AdmissionSerializer(data=data)
    if serializer.is_valid():
        admission = serializer.save()
        return Response(AdmissionSerializer(admission).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Admission by slug
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_admission(request, slug):
    admission = get_object_or_404(Admission, slug=slug)
    data = request.data.dict()
    data["courses"] = safe_json_loads(request.data.get("courses", [])) if "courses" in request.data else None

    serializer = AdmissionSerializer(admission, data=data, partial=True)
    if serializer.is_valid():
        admission = serializer.save()
        return Response(AdmissionSerializer(admission).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete admission
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_admission(request, slug):
    admission = get_object_or_404(Admission, slug=slug)
    admission.delete()
    return Response({"message": "Admission deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
