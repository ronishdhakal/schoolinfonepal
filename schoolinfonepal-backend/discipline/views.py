from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Discipline
from .serializers import DisciplineSerializer

# ✅ Public: List
class DisciplineListView(ListAPIView):
    queryset = Discipline.objects.all().order_by("title")
    serializer_class = DisciplineSerializer
    permission_classes = [AllowAny]

# ✅ Public: Detail
class DisciplineDetailView(RetrieveAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_discipline(request):
    data = request.data.dict()
    serializer = DisciplineSerializer(data=data)
    if serializer.is_valid():
        discipline = serializer.save()
        return Response(DisciplineSerializer(discipline).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_discipline(request, slug):
    discipline = get_object_or_404(Discipline, slug=slug)
    data = request.data.dict()
    serializer = DisciplineSerializer(discipline, data=data, partial=True)
    if serializer.is_valid():
        discipline = serializer.save()
        return Response(DisciplineSerializer(discipline).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_discipline(request, slug):
    discipline = get_object_or_404(Discipline, slug=slug)
    discipline.delete()
    return Response({"message": "Discipline deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
