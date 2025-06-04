import django_filters
from school.models import School
from university.models import University
from course.models import Course
from admission.models import Admission
from event.models import Event
from scholarship.models import Scholarship

class SchoolFilter(django_filters.FilterSet):
    district = django_filters.CharFilter(field_name="district__slug", lookup_expr='iexact')
    university = django_filters.CharFilter(field_name="universities__slug", lookup_expr='iexact')
    level = django_filters.CharFilter(field_name="levels__slug", lookup_expr='iexact')
    type = django_filters.CharFilter(field_name="type__slug", lookup_expr='iexact')
    
    class Meta:
        model = School
        fields = ['district', 'university', 'level', 'type']


class UniversityFilter(django_filters.FilterSet):
    foreign_affiliation = django_filters.BooleanFilter(field_name="foreign_affiliated")

    class Meta:
        model = University
        fields = ['foreign_affiliation']


class CourseFilter(django_filters.FilterSet):
    university = django_filters.CharFilter(field_name="university__slug", lookup_expr='iexact')
    level = django_filters.CharFilter(field_name="level__slug", lookup_expr='iexact')
    discipline = django_filters.CharFilter(field_name="disciplines__slug", lookup_expr='iexact')

    class Meta:
        model = Course
        fields = ['university', 'level', 'discipline']


class AdmissionFilter(django_filters.FilterSet):
    level = django_filters.CharFilter(field_name="level__slug", lookup_expr='iexact')
    school = django_filters.CharFilter(field_name="school__slug", lookup_expr='iexact')
    university = django_filters.CharFilter(field_name="university__slug", lookup_expr='iexact')
    course = django_filters.CharFilter(field_name="courses__slug", lookup_expr='iexact')

    class Meta:
        model = Admission
        fields = ['level', 'school', 'university', 'course']


class EventFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr='iexact', required=False)

    class Meta:
        model = Event
        fields = ['category']
        
class ScholarshipFilter(django_filters.FilterSet):
    level = django_filters.CharFilter(field_name="level__slug", lookup_expr="iexact")
    university = django_filters.CharFilter(field_name="university__slug", lookup_expr="iexact")
    course = django_filters.CharFilter(field_name="courses__slug", lookup_expr="iexact")

    class Meta:
        model = Scholarship
        fields = ['level', 'university', 'course']
