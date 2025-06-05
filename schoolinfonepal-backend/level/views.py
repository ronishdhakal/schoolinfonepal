from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Level
from .serializers import LevelSerializer

# ✅ Public List View
class LevelListView(ListAPIView):
    queryset = Level.objects.all().order_by("title")
    serializer_class = LevelSerializer
    permission_classes = [AllowAny]

# ✅ Public Detail View
class LevelDetailView(RetrieveAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create Level
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_level(request):
    data = request.data.dict()
    serializer = LevelSerializer(data=data)
    if serializer.is_valid():
        level = serializer.save()
        return Response(LevelSerializer(level).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Level
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_level(request, slug):
    level = get_object_or_404(Level, slug=slug)
    data = request.data.dict()
    serializer = LevelSerializer(level, data=data, partial=True)
    if serializer.is_valid():
        level = serializer.save()
        return Response(LevelSerializer(level).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Level
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_level(request, slug):
    level = get_object_or_404(Level, slug=slug)
    level.delete()
    return Response({"message": "Level deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def level_dropdown(request):
    levels = Level.objects.all().values('id', 'title')
    return Response(levels)
