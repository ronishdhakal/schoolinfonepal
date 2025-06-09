from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.text import slugify
from django.shortcuts import get_object_or_404
from core.pagination import StandardResultsSetPagination

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
    pagination_class = StandardResultsSetPagination

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
    print("=== CREATE ADMISSION DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: {value} (type: {type(value)})")
    
    data = request.data.dict()

    # ✅ FIXED: Handle course_ids properly
    if "courses" in request.data:
        course_ids = safe_json_loads(request.data.get("courses", []))
        data["course_ids"] = course_ids
        print(f"Processed course_ids: {course_ids}")

    # ✅ FIXED: Handle level and university IDs with proper validation
    if "level" in data and data["level"]:
        try:
            level_id = int(data["level"])
            # Verify level exists
            if Level.objects.filter(id=level_id).exists():
                data["level"] = level_id
                print(f"Processed level: {data['level']}")
            else:
                print(f"Level with ID {level_id} does not exist")
                data["level"] = None
        except (ValueError, TypeError) as e:
            print(f"Invalid level value: {data['level']}, error: {e}")
            data["level"] = None
    else:
        data["level"] = None

    if "university" in data and data["university"]:
        try:
            university_id = int(data["university"])
            # Verify university exists
            if University.objects.filter(id=university_id).exists():
                data["university"] = university_id
                print(f"Processed university: {data['university']}")
            else:
                print(f"University with ID {university_id} does not exist")
                data["university"] = None
        except (ValueError, TypeError) as e:
            print(f"Invalid university value: {data['university']}, error: {e}")
            data["university"] = None
    else:
        data["university"] = None

    # ✅ FIXED: Handle school_id
    if "school_id" in data and data["school_id"]:
        try:
            school_id = int(data["school_id"])
            if School.objects.filter(id=school_id).exists():
                data["school_id"] = school_id
                print(f"Processed school_id: {data['school_id']}")
            else:
                print(f"School with ID {school_id} does not exist")
                return Response({"school_id": ["School does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError) as e:
            print(f"Invalid school_id value: {data['school_id']}, error: {e}")
            return Response({"school_id": ["Invalid school ID"]}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ FIXED: Handle boolean fields
    if "featured" in data:
        data["featured"] = str(data["featured"]).lower() == "true"

    print(f"Final data for serializer: {data}")

    serializer = AdmissionSerializer(data=data)
    if serializer.is_valid():
        admission = serializer.save()
        print(f"Created admission: {admission.id}")
        print(f"Final admission level: {admission.level}")
        print(f"Final admission university: {admission.university}")
        print(f"Final admission courses: {[c.name for c in admission.courses.all()]}")
        
        return Response(AdmissionSerializer(admission).data, status=status.HTTP_201_CREATED)

    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Admission by slug
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_admission(request, slug):
    print("=== UPDATE ADMISSION DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    print(f"Updating admission with slug: {slug}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: {value} (type: {type(value)})")
    
    admission = get_object_or_404(Admission, slug=slug)
    print(f"Found admission: {admission.id} - {admission.title}")
    print(f"Current level: {admission.level}")
    print(f"Current university: {admission.university}")
    
    data = request.data.dict()
    
    # ✅ FIXED: Handle course_ids properly
    if "courses" in request.data:
        course_ids = safe_json_loads(request.data.get("courses", []))
        data["course_ids"] = course_ids
        print(f"Processed course_ids: {course_ids}")

    # ✅ FIXED: Handle level and university IDs with proper validation
    if "level" in data:
        if data["level"]:
            try:
                level_id = int(data["level"])
                # Verify level exists
                if Level.objects.filter(id=level_id).exists():
                    data["level"] = level_id
                    print(f"Processed level: {data['level']}")
                else:
                    print(f"Level with ID {level_id} does not exist")
                    data["level"] = None
            except (ValueError, TypeError) as e:
                print(f"Invalid level value: {data['level']}, error: {e}")
                data["level"] = None
        else:
            data["level"] = None
            print("Level set to None")

    if "university" in data:
        if data["university"]:
            try:
                university_id = int(data["university"])
                # Verify university exists
                if University.objects.filter(id=university_id).exists():
                    data["university"] = university_id
                    print(f"Processed university: {data['university']}")
                else:
                    print(f"University with ID {university_id} does not exist")
                    data["university"] = None
            except (ValueError, TypeError) as e:
                print(f"Invalid university value: {data['university']}, error: {e}")
                data["university"] = None
        else:
            data["university"] = None
            print("University set to None")

    # ✅ FIXED: Handle school_id
    if "school_id" in data and data["school_id"]:
        try:
            school_id = int(data["school_id"])
            if School.objects.filter(id=school_id).exists():
                data["school_id"] = school_id
                print(f"Processed school_id: {data['school_id']}")
            else:
                print(f"School with ID {school_id} does not exist")
                return Response({"school_id": ["School does not exist"]}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError) as e:
            print(f"Invalid school_id value: {data['school_id']}, error: {e}")
            return Response({"school_id": ["Invalid school ID"]}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ FIXED: Handle boolean fields
    if "featured" in data:
        data["featured"] = str(data["featured"]).lower() == "true"

    print(f"Final data for serializer: {data}")

    serializer = AdmissionSerializer(admission, data=data, partial=True)
    if serializer.is_valid():
        admission = serializer.save()
        print(f"Updated admission: {admission.id}")
        print(f"Final admission level: {admission.level}")
        print(f"Final admission university: {admission.university}")
        print(f"Final admission courses: {[c.name for c in admission.courses.all()]}")
        
        return Response(AdmissionSerializer(admission).data, status=status.HTTP_200_OK)

    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete admission
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_admission(request, slug):
    admission = get_object_or_404(Admission, slug=slug)
    print(f"Deleting admission: {admission.id} - {admission.title}")
    admission.delete()
    return Response({"message": "Admission deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
