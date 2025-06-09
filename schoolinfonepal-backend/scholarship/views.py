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
from core.pagination import StandardResultsSetPagination

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
        'university__name', 'level__title'
    ]
    ordering_fields = ['published_date', 'active_from', 'active_until', 'created_at']
    pagination_class = StandardResultsSetPagination

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
    print("=== CREATE SCHOLARSHIP DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: '{value}' (type: {type(value)})")
    
    data = request.data.dict()
    
    # --- Robust list extraction for course_ids ---
    if "course_ids" in request.data or "course_ids[]" in request.data:
        courses_data = request.data.getlist("course_ids") or request.data.getlist("course_ids[]")
        data["course_ids"] = [int(cid) for cid in courses_data if cid]
        print(f"Processed course_ids: {data['course_ids']}")
    else:
        data["course_ids"] = []
    
    # Organizer fields
    organizer_school = data.get("organizer_school_id", "")
    organizer_university = data.get("organizer_university_id", "")
    organizer_custom = data.get("organizer_custom", "")
    
    print(f"=== ORGANIZER DEBUG ===")
    print(f"organizer_school_id: '{organizer_school}'")
    print(f"organizer_university_id: '{organizer_university}'")
    print(f"organizer_custom: '{organizer_custom}'")
    
    # Convert empty strings to None for foreign key fields
    if organizer_school and str(organizer_school).strip():
        try:
            data["organizer_school_id"] = int(organizer_school)
            print(f"Processed organizer_school_id: {data['organizer_school_id']}")
        except (ValueError, TypeError):
            print(f"Invalid organizer_school_id value: {organizer_school}")
            data["organizer_school_id"] = None
    else:
        data["organizer_school_id"] = None
        
    if organizer_university and str(organizer_university).strip():
        try:
            data["organizer_university_id"] = int(organizer_university)
            print(f"Processed organizer_university_id: {data['organizer_university_id']}")
        except (ValueError, TypeError):
            print(f"Invalid organizer_university_id value: {organizer_university}")
            data["organizer_university_id"] = None
    else:
        data["organizer_university_id"] = None
        
    if organizer_custom and str(organizer_custom).strip():
        data["organizer_custom"] = organizer_custom.strip()
        print(f"Processed organizer_custom: '{data['organizer_custom']}'")
    else:
        data["organizer_custom"] = ""
    
    # Handle other optional fields (FKs)
    if "level_id" in data and data["level_id"]:
        try:
            data["level_id"] = int(data["level_id"])
            print(f"Processed level_id: {data['level_id']}")
        except (ValueError, TypeError):
            data["level_id"] = None
    else:
        data["level_id"] = None
        
    if "university_id" in data and data["university_id"]:
        try:
            data["university_id"] = int(data["university_id"])
            print(f"Processed university_id: {data['university_id']}")
        except (ValueError, TypeError):
            data["university_id"] = None
    else:
        data["university_id"] = None

    # Handle boolean fields
    if "featured" in data:
        data["featured"] = str(data["featured"]).lower() == "true"

    print(f"Final data for serializer: {data}")

    serializer = ScholarshipSerializer(data=data)
    if serializer.is_valid():
        scholarship = serializer.save()
        print(f"Created scholarship: {scholarship.id}")
        return Response(ScholarshipSerializer(scholarship).data, status=status.HTTP_201_CREATED)
    
    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Scholarship
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_scholarship(request, slug):
    print("=== UPDATE SCHOLARSHIP DEBUG ===")
    print(f"Updating scholarship with slug: {slug}")
    
    # Log all request data
    for key, value in request.data.items():
        print(f"{key}: '{value}' (type: {type(value)})")
    
    scholarship = get_object_or_404(Scholarship, slug=slug)
    data = request.data.dict()
    
    # --- Robust list extraction for course_ids ---
    if "course_ids" in request.data or "course_ids[]" in request.data:
        courses_data = request.data.getlist("course_ids") or request.data.getlist("course_ids[]")
        data["course_ids"] = [int(cid) for cid in courses_data if cid]
        print(f"Processed course_ids: {data['course_ids']}")
    else:
        data["course_ids"] = []
    
    # Organizer fields
    if "organizer_school_id" in data:
        organizer_school = data.get("organizer_school_id", "")
        if organizer_school and str(organizer_school).strip():
            try:
                data["organizer_school_id"] = int(organizer_school)
            except (ValueError, TypeError):
                data["organizer_school_id"] = None
        else:
            data["organizer_school_id"] = None
            
    if "organizer_university_id" in data:
        organizer_university = data.get("organizer_university_id", "")
        if organizer_university and str(organizer_university).strip():
            try:
                data["organizer_university_id"] = int(organizer_university)
            except (ValueError, TypeError):
                data["organizer_university_id"] = None
        else:
            data["organizer_university_id"] = None
            
    if "organizer_custom" in data:
        organizer_custom = data.get("organizer_custom", "")
        data["organizer_custom"] = organizer_custom.strip() if organizer_custom else ""
    
    # Handle other FKs
    if "level_id" in data and data["level_id"]:
        try:
            data["level_id"] = int(data["level_id"])
        except (ValueError, TypeError):
            data["level_id"] = None
    elif "level_id" in data:
        data["level_id"] = None
        
    if "university_id" in data and data["university_id"]:
        try:
            data["university_id"] = int(data["university_id"])
        except (ValueError, TypeError):
            data["university_id"] = None
    elif "university_id" in data:
        data["university_id"] = None

    # Handle boolean fields
    if "featured" in data:
        data["featured"] = str(data["featured"]).lower() == "true"

    print(f"Final update data: {data}")
    
    serializer = ScholarshipSerializer(scholarship, data=data, partial=True)
    if serializer.is_valid():
        scholarship = serializer.save()
        print(f"Updated scholarship: {scholarship.id}")
        return Response(ScholarshipSerializer(scholarship).data, status=status.HTTP_200_OK)
    
    print(f"Update serializer errors: {serializer.errors}")
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
