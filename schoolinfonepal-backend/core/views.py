from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q

from school.models import School
from university.models import University
from course.models import Course
from admission.models import Admission
from event.models import Event
from information.models import Information

from school.serializers import SchoolSerializer
from university.serializers import UniversitySerializer
from course.serializers import CourseSerializer
from admission.serializers import AdmissionSerializer
from event.serializers import EventSerializer
from information.serializers import InformationSerializer


class GlobalSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('q', '')

        if not query:
            return Response({'error': 'No query provided'}, status=400)

        results = {
            'schools': SchoolSerializer(
                School.objects.filter(
                    Q(name__icontains=query) |
                    Q(address__icontains=query) |
                    Q(courses__name__icontains=query) |
                    Q(universities__name__icontains=query)
                ).distinct()[:5],
                many=True
            ).data,

            'universities': UniversitySerializer(
                University.objects.filter(name__icontains=query)[:5],
                many=True
            ).data,

            'courses': CourseSerializer(
                Course.objects.filter(
                    Q(name__icontains=query) |
                    Q(abbreviation__icontains=query) |
                    Q(university__name__icontains=query)
                ).distinct()[:5],
                many=True
            ).data,

            'admissions': AdmissionSerializer(
                Admission.objects.filter(
                    Q(title__icontains=query) |
                    Q(school__name__icontains=query) |
                    Q(university__name__icontains=query)
                ).distinct()[:5],
                many=True
            ).data,

            'events': EventSerializer(
                Event.objects.filter(title__icontains=query)[:5],
                many=True
            ).data,

            'information': InformationSerializer(
                Information.objects.filter(title__icontains=query)[:5],
                many=True
            ).data,
        }

        return Response(results)
