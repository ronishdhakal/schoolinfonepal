from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from .models import School
from .serializers import SchoolSerializer
from core.filters import SchoolFilter
import json

def safe_json_loads(val):
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

class SchoolListView(ListAPIView):
    queryset = School.objects.all().order_by('-priority', 'name')
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SchoolFilter
    search_fields = ['title', 'address', 'district__name', 'courses__name', 'universities__name', 'levels__name']

class SchoolDetailView(RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_school(request):
    data = request.data.dict()
    for key in ['phones', 'emails', 'gallery', 'brochures', 'social_media', 'faqs', 'messages', 'school_courses', 'facilities', 'universities']:
        data[key] = safe_json_loads(request.data.get(key, "[]"))

    serializer = SchoolSerializer(data=data)
    if serializer.is_valid():
        school = serializer.save()

        for file_field in ["logo", "cover_photo"]:
            if file_field in request.FILES:
                setattr(school, file_field, request.FILES[file_field])
        school.save()

        return Response(SchoolSerializer(school).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_school(request, slug):
    school = get_object_or_404(School, slug=slug)
    data = request.data.dict()
    for key in ['phones', 'emails', 'gallery', 'brochures', 'social_media', 'faqs', 'messages', 'school_courses', 'facilities', 'universities']:
        if key in request.data:
            data[key] = safe_json_loads(request.data.get(key, "[]"))

    serializer = SchoolSerializer(school, data=data, partial=True)
    if serializer.is_valid():
        school = serializer.save()

        for file_field in ["logo", "cover_photo"]:
            if file_field in request.FILES:
                if getattr(school, file_field):
                    getattr(school, file_field).delete(save=False)
                setattr(school, file_field, request.FILES[file_field])
        school.save()

        return Response(SchoolSerializer(school).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_school(request, slug):
    school = get_object_or_404(School, slug=slug)
    for file_field in ["logo", "cover_photo"]:
        if getattr(school, file_field):
            getattr(school, file_field).delete(save=False)
    school.delete()
    return Response({"message": "School deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Dashboard-only views
class SchoolOwnDetailView(RetrieveAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.school

class SchoolOwnUpdateView(SchoolOwnDetailView):
    def patch(self, request, *args, **kwargs):
        return update_school(request, self.get_object().slug)
