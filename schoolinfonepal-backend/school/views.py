from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from .models import School, SchoolGallery, SchoolBrochure, SchoolMessage
from .serializers import SchoolSerializer
from core.filters import SchoolFilter
import json

def safe_json_loads(val):
    """Utility: safely decode JSON or pass through lists/dicts."""
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
    search_fields = [
        'name', 'address', 'district__name',
        'school_courses__course__name', 'universities__name', 'level__name'
    ]

class SchoolDetailView(RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_school(request):
    data = request.data.copy()
    # --- Parse nested JSON fields ---
    for field in [
        "phones", "emails", "gallery", "brochures", "social_media",
        "faqs", "messages", "school_courses"
    ]:
        data[field] = safe_json_loads(request.data.get(field, "[]"))

    # For M2M, set all sent values as lists
    data.setlist("facilities", request.data.getlist("facilities"))
    data.setlist("universities", request.data.getlist("universities"))

    # Save with blank files first
    serializer = SchoolSerializer(data=data)
    if serializer.is_valid():
        school = serializer.save()

        # --- FILE HANDLING (logo, cover, gallery, brochures, message image) ---
        if "logo" in request.FILES:
            school.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            school.cover_photo = request.FILES["cover_photo"]
        school.save()

        # --- GALLERY IMAGES ---
        gallery = safe_json_loads(request.data.get("gallery", "[]"))
        for i, item in enumerate(gallery):
            img_key = f"gallery_{i}_image"
            image = request.FILES.get(img_key)
            caption = item.get("caption", "")
            if image:
                SchoolGallery.objects.create(school=school, image=image, caption=caption)
            elif item.get("image"):  # Already uploaded path (string)
                SchoolGallery.objects.create(school=school, image=item["image"], caption=caption)

        # --- BROCHURES (optional) ---
        brochures = safe_json_loads(request.data.get("brochures", "[]"))
        for i, item in enumerate(brochures):
            file_key = f"brochures_{i}_file"
            brochure_file = request.FILES.get(file_key)
            description = item.get("description", "")
            if brochure_file:
                SchoolBrochure.objects.create(school=school, file=brochure_file, description=description)
            elif item.get("file"):
                SchoolBrochure.objects.create(school=school, file=item["file"], description=description)

        # --- PRINCIPAL/HEAD MESSAGE IMAGE ---
        messages = safe_json_loads(request.data.get("messages", "[]"))
        for i, msg in enumerate(messages):
            img_key = f"messages_{i}_image"
            msg_image = request.FILES.get(img_key)
            msg_data = {
                "school": school,
                "title": msg.get("title", ""),
                "message": msg.get("message", ""),
                "name": msg.get("name", ""),
                "designation": msg.get("designation", ""),
                "image": msg_image if msg_image else msg.get("image", None)
            }
            # Only save if at least one field is filled (optional, for defense)
            if any([msg_data["title"], msg_data["message"], msg_data["name"], msg_data["designation"], msg_data["image"]]):
                SchoolMessage.objects.create(**msg_data)

        return Response(SchoolSerializer(school).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_school(request, slug):
    school = get_object_or_404(School, slug=slug)
    data = request.data.copy()
    for field in [
        "phones", "emails", "gallery", "brochures", "social_media",
        "faqs", "messages", "school_courses"
    ]:
        data[field] = safe_json_loads(request.data.get(field, "[]"))

    data.setlist("facilities", request.data.getlist("facilities"))
    data.setlist("universities", request.data.getlist("universities"))

    serializer = SchoolSerializer(school, data=data, partial=True)
    if serializer.is_valid():
        school = serializer.save()

        # --- FILE HANDLING (logo, cover, gallery, brochures, message image) ---
        if "logo" in request.FILES:
            if school.logo:
                school.logo.delete(save=False)
            school.logo = request.FILES["logo"]
        if "cover_photo" in request.FILES:
            if school.cover_photo:
                school.cover_photo.delete(save=False)
            school.cover_photo = request.FILES["cover_photo"]
        school.save()

        # --- NESTED FILES: Clear & Re-create gallery, brochures, messages ---
        # Gallery
        school.gallery.all().delete()
        gallery = safe_json_loads(request.data.get("gallery", "[]"))
        for i, item in enumerate(gallery):
            img_key = f"gallery_{i}_image"
            image = request.FILES.get(img_key)
            caption = item.get("caption", "")
            if image:
                SchoolGallery.objects.create(school=school, image=image, caption=caption)
            elif item.get("image"):  # Already uploaded path (string)
                SchoolGallery.objects.create(school=school, image=item["image"], caption=caption)

        # Brochures
        school.brochures.all().delete()
        brochures = safe_json_loads(request.data.get("brochures", "[]"))
        for i, item in enumerate(brochures):
            file_key = f"brochures_{i}_file"
            brochure_file = request.FILES.get(file_key)
            description = item.get("description", "")
            if brochure_file:
                SchoolBrochure.objects.create(school=school, file=brochure_file, description=description)
            elif item.get("file"):
                SchoolBrochure.objects.create(school=school, file=item["file"], description=description)

        # Messages
        school.messages.all().delete()
        messages = safe_json_loads(request.data.get("messages", "[]"))
        for i, msg in enumerate(messages):
            img_key = f"messages_{i}_image"
            msg_image = request.FILES.get(img_key)
            msg_data = {
                "school": school,
                "title": msg.get("title", ""),
                "message": msg.get("message", ""),
                "name": msg.get("name", ""),
                "designation": msg.get("designation", ""),
                "image": msg_image if msg_image else msg.get("image", None)
            }
            if any([msg_data["title"], msg_data["message"], msg_data["name"], msg_data["designation"], msg_data["image"]]):
                SchoolMessage.objects.create(**msg_data)

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

@api_view(['GET'])
def school_dropdown(request):
    schools = School.objects.all().values('id', 'name')
    return Response(schools)
