from django.contrib import admin
from .models import Student, Course, Enrollment

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'age', 'owner', 'created_at']
    list_filter = ['age', 'created_at', 'owner']
    search_fields = ['name', 'email']
    readonly_fields = ['created_at']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'is_published', 'owner', 'created_at']
    list_filter = ['is_published', 'price', 'owner']
    search_fields = ['title']
    readonly_fields = ['created_at']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrolled_at', 'is_active']
    list_filter = ['is_active', 'enrolled_at']
    readonly_fields = ['enrolled_at']

