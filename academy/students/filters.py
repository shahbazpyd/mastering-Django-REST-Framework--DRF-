# students/filters.py
import django_filters
from .models import Student

class StudentFilter(django_filters.FilterSet):
    # Exact match
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    # Range filters
    min_age = django_filters.NumberFilter(field_name='age', lookup_expr='gte')
    max_age = django_filters.NumberFilter(field_name='age', lookup_expr='lte')
    
    # Date range
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    
    class Meta:
        model = Student
        fields = ['name', 'min_age', 'max_age']
