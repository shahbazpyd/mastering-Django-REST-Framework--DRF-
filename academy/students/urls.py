from django.urls import path, include
from rest_framework.routers import DefaultRouter

from students.views_api import StudentListCreateAPIView, StudentListCreateGenericAPIView
from .views import StudentDetailAPIView, StudentListAPIView, StudentViewSet, student_detail, student_list, TaskStatusAPIView, CourseViewSet


# Create a router and register our ViewSet
router = DefaultRouter()
router.register(r'viewset-students', StudentViewSet, basename='student')
router.register("courses", CourseViewSet, basename="courses")


urlpatterns = [
    # 1. Path for our manual APIView
    # path('apiview-students/', StudentListAPIView.as_view(), name='student-list-manual'),
        # List/Create path
    path('manual-students/', StudentListAPIView.as_view()),
    
    # Detail path (requires ID)
    path('manual-students/<int:pk>/', StudentDetailAPIView.as_view()), 
    
    # 2. Path for our automatic ViewSet (The router generates the URLs for us)
    path('', include(router.urls)),
    path('tasks/<str:task_id>/', TaskStatusAPIView.as_view(), name='task-status'),
    
    path('fbv-students/', student_list),
    path('fbv-students/<int:pk>/', student_detail),



    path("students-api-view/", StudentListCreateAPIView.as_view(), name="students-api-view"),
    path("students-generic/", StudentListCreateGenericAPIView.as_view(), name="students-generic"),
]
urlpatterns += router.urls
