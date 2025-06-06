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

from .models import Course, CourseAttachment
from .serializers import CourseSerializer
from core.filters import CourseFilter

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
class CourseListView(ListAPIView):
    queryset = Course.objects.all().order_by('-updated_at', '-created_at')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CourseFilter
    search_fields = [
        'name', 'abbreviation',
        'university__name', 'duration',
        'level__name', 'disciplines__name',
    ]

# ✅ Public: Detail
class CourseDetailView(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create Course
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_course(request):
    data = request.data.dict()
    data["disciplines"] = safe_json_loads(request.data.get("disciplines", []))
    data["attachments"] = safe_json_loads(request.data.get("attachments", []))
    data["long_description"] = request.data.get("long_description", "")

    serializer = CourseSerializer(data=data)
    if serializer.is_valid():
        course = serializer.save()

        # Handle og_image
        if "og_image" in request.FILES:
            course.og_image = request.FILES["og_image"]
            course.save()

        # Handle attachments with files
        for file in request.FILES.getlist("attachment_files"):
            CourseAttachment.objects.create(course=course, file=file, description="")

        return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Course
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    data = request.data.dict()
    
    # Handle disciplines
    if "disciplines" in request.data:
        data["disciplines"] = safe_json_loads(request.data.get("disciplines", []))
    
    # Handle long_description
    if "long_description" in request.data:
        data["long_description"] = request.data.get("long_description", "")
    
    # Handle attachments - only if explicitly provided
    # This prevents the "attachments cannot be null" error
    if "attachments" in request.data:
        attachments_data = safe_json_loads(request.data.get("attachments", []))
        data["attachments"] = attachments_data
        
        # If attachments is empty array, it means user wants to remove all existing attachments
        if attachments_data == []:
            # Delete existing attachments
            for attachment in course.attachments.all():
                if attachment.file:
                    attachment.file.delete(save=False)
                attachment.delete()

    # Don't include attachments in serializer data if not provided
    serializer_data = {k: v for k, v in data.items() if k != 'attachments' or 'attachments' in request.data}
    
    serializer = CourseSerializer(course, data=serializer_data, partial=True)
    if serializer.is_valid():
        course = serializer.save()

        # Update image
        if "og_image" in request.FILES:
            if course.og_image:
                course.og_image.delete(save=False)
            course.og_image = request.FILES["og_image"]
            course.save()

        # Upload new attachment files (always append, don't replace existing)
        for file in request.FILES.getlist("attachment_files"):
            CourseAttachment.objects.create(course=course, file=file, description="")

        return Response(CourseSerializer(course).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Course
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    if course.og_image:
        course.og_image.delete(save=False)
    for attachment in course.attachments.all():
        if attachment.file:
            attachment.file.delete(save=False)
        attachment.delete()
    course.delete()
    return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_dropdown(request):
    courses = Course.objects.all().values('id', 'name')
    return Response(courses)
