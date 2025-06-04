from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Type
from .serializers import TypeSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def type_list(request):
    types = Type.objects.all()
    serializer = TypeSerializer(types, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def type_detail(request, slug):
    type_obj = get_object_or_404(Type, slug=slug)
    serializer = TypeSerializer(type_obj)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def type_create(request):
    serializer = TypeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def type_update(request, slug):
    type_obj = get_object_or_404(Type, slug=slug)
    serializer = TypeSerializer(type_obj, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def type_delete(request, slug):
    type_obj = get_object_or_404(Type, slug=slug)
    type_obj.delete()
    return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
