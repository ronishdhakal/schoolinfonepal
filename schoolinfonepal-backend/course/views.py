from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from core.pagination import StandardResultsSetPagination

from django.shortcuts import get_object_or_404
import json

from .models import Course, CourseAttachment
from .serializers import CourseSerializer
from core.filters import CourseFilter
from university.models import University
from level.models import Level

def safe_json_loads(val):
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

def safe_file_delete(file_field):
    """Safely delete a file, handling invalid paths gracefully"""
    if not file_field:
        return
    try:
        if file_field and hasattr(file_field, 'delete'):
            file_field.delete(save=False)
    except (OSError, ValueError) as e:
        print(f"Warning: Could not delete file {file_field}: {e}")

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
        'level__title', 'disciplines__title',
    ]
    pagination_class = StandardResultsSetPagination

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
    print("=== CREATE COURSE DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: {value} (type: {type(value)})")
    
    data = request.data.dict()
    
    # ✅ FIXED: Handle university_id with proper validation
    if "university" in data and data["university"]:
        try:
            university_id = int(data["university"])
            if University.objects.filter(id=university_id).exists():
                data["university_id"] = university_id
                print(f"Processed university_id: {data['university_id']}")
            else:
                print(f"University with ID {university_id} does not exist")
                return Response({"university_id": ["University does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError) as e:
            print(f"Invalid university value: {data['university']}, error: {e}")
            return Response({"university_id": ["Invalid university ID"]}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"university_id": ["University is required"]}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ FIXED: Handle level_id with proper validation
    if "level" in data and data["level"]:
        try:
            level_id = int(data["level"])
            if Level.objects.filter(id=level_id).exists():
                data["level_id"] = level_id
                print(f"Processed level_id: {data['level_id']}")
            else:
                print(f"Level with ID {level_id} does not exist")
                data["level_id"] = None
        except (ValueError, TypeError) as e:
            print(f"Invalid level value: {data['level']}, error: {e}")
            data["level_id"] = None
    else:
        data["level_id"] = None

    # ✅ FIXED: Handle disciplines properly
    if "disciplines" in request.data:
        disciplines_data = safe_json_loads(request.data.get("disciplines", []))
        data["disciplines"] = disciplines_data
        print(f"Processed disciplines: {disciplines_data}")

    # Remove the original fields to avoid conflicts
    data.pop("university", None)
    data.pop("level", None)

    print(f"Final data for serializer: {data}")

    serializer = CourseSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        course = serializer.save()
        print(f"Created course: {course.id}")
        print(f"Final course university: {course.university}")
        print(f"Final course level: {course.level}")
        print(f"Final course disciplines: {[d.title for d in course.disciplines.all()]}")

        # Handle og_image
        if "og_image" in request.FILES:
            course.og_image = request.FILES["og_image"]
            course.save()
            print("Added OG image")

        # Handle attachments with files
        for file in request.FILES.getlist("attachment_files"):
            CourseAttachment.objects.create(course=course, file=file, description="")
            print(f"Added attachment: {file.name}")

        return Response(CourseSerializer(course, context={'request': request}).data, status=status.HTTP_201_CREATED)

    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Course
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_course(request, slug):
    print("=== UPDATE COURSE DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    print(f"Updating course with slug: {slug}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: {value} (type: {type(value)})")
    
    course = get_object_or_404(Course, slug=slug)
    print(f"Found course: {course.id} - {course.name}")
    print(f"Current university: {course.university}")
    print(f"Current level: {course.level}")
    
    data = request.data.dict()
    
    # ✅ FIXED: Handle university_id with proper validation
    if "university" in data:
        if data["university"]:
            try:
                university_id = int(data["university"])
                if University.objects.filter(id=university_id).exists():
                    data["university_id"] = university_id
                    print(f"Processed university_id: {data['university_id']}")
                else:
                    print(f"University with ID {university_id} does not exist")
                    return Response({"university_id": ["University does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError) as e:
                print(f"Invalid university value: {data['university']}, error: {e}")
                return Response({"university_id": ["Invalid university ID"]}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"university_id": ["University is required"]}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ FIXED: Handle level_id with proper validation
    if "level" in data:
        if data["level"]:
            try:
                level_id = int(data["level"])
                if Level.objects.filter(id=level_id).exists():
                    data["level_id"] = level_id
                    print(f"Processed level_id: {data['level_id']}")
                else:
                    print(f"Level with ID {level_id} does not exist")
                    data["level_id"] = None
            except (ValueError, TypeError) as e:
                print(f"Invalid level value: {data['level']}, error: {e}")
                data["level_id"] = None
        else:
            data["level_id"] = None
            print("Level set to None")

    # ✅ FIXED: Handle disciplines properly
    if "disciplines" in request.data:
        disciplines_data = safe_json_loads(request.data.get("disciplines", []))
        data["disciplines"] = disciplines_data
        print(f"Processed disciplines: {disciplines_data}")
        
        # If disciplines is empty array, it means user wants to remove all existing disciplines
        if disciplines_data == []:
            print("Clearing all disciplines")

    # Handle attachments - only if explicitly provided
    if "attachments" in request.data:
        attachments_data = safe_json_loads(request.data.get("attachments", []))
        data["attachments"] = attachments_data
        
        # If attachments is empty array, it means user wants to remove all existing attachments
        if attachments_data == []:
            print("Deleting existing attachments")
            for attachment in course.attachments.all():
                safe_file_delete(attachment.file)
                attachment.delete()

    # Remove the original fields to avoid conflicts
    data.pop("university", None)
    data.pop("level", None)

    # Don't include attachments in serializer data if not provided
    serializer_data = {k: v for k, v in data.items() if k != 'attachments' or 'attachments' in request.data}
    
    print(f"Final data for serializer: {serializer_data}")

    serializer = CourseSerializer(course, data=serializer_data, partial=True, context={'request': request})
    if serializer.is_valid():
        course = serializer.save()
        print(f"Updated course: {course.id}")
        print(f"Final course university: {course.university}")
        print(f"Final course level: {course.level}")
        print(f"Final course disciplines: {[d.title for d in course.disciplines.all()]}")

        # Update image
        if "og_image" in request.FILES:
            if course.og_image:
                safe_file_delete(course.og_image)
            course.og_image = request.FILES["og_image"]
            course.save()
            print("Updated OG image")

        # Upload new attachment files (always append, don't replace existing)
        for file in request.FILES.getlist("attachment_files"):
            CourseAttachment.objects.create(course=course, file=file, description="")
            print(f"Added new attachment: {file.name}")

        return Response(CourseSerializer(course, context={'request': request}).data, status=status.HTTP_200_OK)

    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Course
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    print(f"Deleting course: {course.id} - {course.name}")
    
    # Clean up files
    if course.og_image:
        safe_file_delete(course.og_image)
    for attachment in course.attachments.all():
        safe_file_delete(attachment.file)
        attachment.delete()
    
    course.delete()
    return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_dropdown(request):
    courses = Course.objects.all().values('id', 'name')
    return Response(courses)
