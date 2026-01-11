from django.shortcuts import render

# # Create your views here.
# from rest_framework.authentication import TokenAuthentication
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from rest_framework.viewsets import ModelViewSet
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Student
# from .serializers import StudentSerializer


# # Method 1: APIView (Manual Control)
# class StudentListAPIView(APIView):
    
#     # Handle GET request (List all students)
#     def get(self, request):
#         students = Student.objects.all()
#         # many=True is important because we are serializing a LIST of items, not just one
#         serializer = StudentSerializer(students, many=True) 
#         return Response(serializer.data)

#     # Handle POST request (Create a new student)
#     def post(self, request):
#         serializer = StudentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .filters import StudentFilter
from .models import Student
from .serializers import StudentSerializer
# from .permissions import IsOwnerOrReadOnly

# ==========================================
# CLASS 1: Collection Level ( /students/ )
# ==========================================
class StudentListAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # 1. GET (List): Fetch all students
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    # 2. POST (Create): Add a new student
    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            # Manual version of perform_create:
            serializer.save(created_by=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================================
# CLASS 2: Detail Level ( /students/<pk>/ )
# ==========================================
class StudentDetailAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    # Helper method to get object or return 404
    def get_object(self, pk):
        student = get_object_or_404(Student, pk=pk)
        self.check_object_permissions(self.request, student) # Manually trigger permissions
        return student

    # 3. GET (Retrieve): Fetch ONE student
    def get(self, request, pk):
        student = self.get_object(pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    # 4. PUT (Update): Replace entire student object
    def put(self, request, pk):
        student = self.get_object(pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # 5. PATCH (Partial Update): Update specific fields (e.g. just the age)
    def patch(self, request, pk):
        student = self.get_object(pk)
        # partial=True is the only difference from PUT
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 6. DELETE (Destroy): Remove student
    def delete(self, request, pk):
        student = self.get_object(pk)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



from rest_framework import viewsets

# Method 2: ModelViewSet (Automatic CRUD)
# class StudentViewSet(ModelViewSet):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class StudentViewSet(viewsets.ModelViewSet):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer
    
#     # 1. Who are you? (Check for a Token)
#     authentication_classes = [TokenAuthentication]
    
#     # 2. Are you allowed? (Must be logged in)
#     permission_classes = [IsAuthenticated]

from .permissions import IsStudentOwner # Import your new permission
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .tasks import send_welcome_email_task, send_student_created_ws_task, generate_report_task
from django.conf import settings
# print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)


class StudentPagination(PageNumberPagination):
    page_size = 5  # Override: Show only 5 per page for this ViewSet
    page_size_query_param = 'page_size'  # Allow ?page_size=10 in URL
    max_page_size = 10  # Prevent abuse: max 10 per page

class StudentViewSet(viewsets.ModelViewSet):
    filterset_class = StudentFilter  # Use custom filters
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    queryset = Student.objects.all().order_by('-created_at')
    serializer_class = StudentSerializer
    # authentication_classes = [TokenAuthentication]
    pagination_class = StudentPagination  # Custom pagination
    
    # Update permissions: Must be Authenticated AND (if editing) must be Owner
    permission_classes = [IsAuthenticated, IsStudentOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # Enable built-in filters

    # Search only these fields
    search_fields = ['name', 'email']
    
    # Allow sorting by these fields
    ordering_fields = ['name', 'age', 'created_at']
    ordering = ['name']  # Default sort

    # This method is called when we create a new object
    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)
        # Automatically set the 'created_by' field to the current user
        # serializer.save(created_by=self.request.user)

    # def perform_create(self, serializer):
    #     student = serializer.save()
    #     print(f"[ViewSet] {self.request.user} created {student.name}")

    # def perform_update(self, serializer):
    #     student = serializer.save()
    #     print(f"[ViewSet] {self.request.user} updated {student.id}")

    def perform_create(self, serializer):
        student = serializer.save(owner=self.request.user)

        user = self.request.user if self.request.user.is_authenticated else None
        user_id = user.id if user else None

    #     # async email
        send_welcome_email_task.delay(
            student_id=student.id,
            email=student.email,
            name=student.name,
        )

    #     # async websocket notification
    #     send_student_created_ws_task.delay(
    #         student_id=student.id,
    #         user_id=user_id,
    #     )


    # ========== ACTIONS ==========
    
    # @action(detail=True, methods=['post'])
    # def send_welcome_email(self, request, pk=None):
    #     """
    #     Custom action: Send welcome email to a specific student
    #     URL: /api/viewset-students/1/send_welcome_email/
    #     """
    #     self.throttle_scope = 'student_email'  # optional extra scope
    #     student = self.get_object()  # Gets the student with pk=1
    #     # Simulate sending email (in real app, integrate with Django Email)
    #     email_content = f"Welcome {student.name}! Your account is active."
        
    #     return Response({
    #         'message': 'Welcome email sent successfully!',
    #         'student': student.name,
    #         'email_content': email_content[:50] + '...'
    #     })

    # @action(detail=True, methods=['post'])
    # def send_welcome_email(self, request, pk=None):
    #     print("send_welcome_email called")
    #     print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)
    #     student = self.get_object()

    #     # Async call: returns immediately
    #     print(student.name, student.email)
    #     task = send_welcome_email_task.delay(student.name, student.email)
    #     print("Task ID:", task.id)
    #     return Response({
    #         'message': 'Welcome email scheduled!',
    #         'student': student.name,
    #         'student_email': student.email,
    #         'task_id': task.id,
    #     })


    # @action(detail=True, methods=['post'])
    # def generate_report(self, request, pk=None):
    #     student = self.get_object()
    #     task = generate_report_task.delay(student.id)
    #     return Response({
    #         "message": "Report generation started",
    #         "student": student.name,
    #         "task_id": task.id,
    #     })

    @action(detail=True, methods=['post'])
    def generate_report(self, request, pk=None):
        student = self.get_object()
        user_id = request.user.id if request.user.is_authenticated else None

        task = generate_report_task.delay(student.id, user_id)

        return Response({
            "message": "Report generation started",
            "student": student.name,
            "task_id": task.id,
        })


    @action(detail=False, methods=['get'])
    def active_students(self, request):
        """
        Custom action: List only active students (across ALL students)
        URL: /api/viewset-students/active_students/
        """
        # Simulate "active" filter (add is_active field later)
        active = Student.objects.filter(age__gte=18)  # Adults are "active"
        serializer = self.get_serializer(active, many=True)

        # Disable pagination for this action
        page = self.paginate_queryset(serializer.data)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(serializer.data)  # No pagination!

    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        """
        Custom action: Deactivate a specific student
        URL: /api/viewset-students/1/deactivate/
        """
        student = self.get_object()
        # Simulate deactivation (add is_active field later)
        student.age = 0  # Mark as inactive
        student.save()
        
        return Response({
            'message': f'Student {student.name} deactivated successfully',
            'student_id': student.id
        })
    
    def get_throttles(self):
    # Per-action scopes
        if self.action == 'create':
            self.throttle_scope = 'student_create'
        return super().get_throttles()

from celery.result import AsyncResult
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class TaskStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        result = AsyncResult(task_id)  # uses CELERY_RESULT_BACKEND[web:92][web:93]

        return Response({
            "task_id": task_id,
            "state": result.state,      # PENDING / STARTED / SUCCESS / FAILURE[web:92][web:93]
            "result": str(result.result)
        })



from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Student
from .serializers import StudentSerializer
# from .permissions import IsOwnerOrReadOnly
from rest_framework.authentication import TokenAuthentication

# ==========================================
# FUNCTION-BASED VIEWS (FBV)
# ==========================================

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def student_list(request):
    """
    GET: List all students
    POST: Create a new student
    """
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated, IsOwnerOrReadOnly])
def student_detail(request, pk):
    """
    GET: Retrieve a student
    PUT: Update entire student
    PATCH: Partial update
    DELETE: Delete student
    """
    student = get_object_or_404(Student, pk=pk)
    
    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PATCH':
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Course
from .serializers import CourseSerializer
from .permissions import IsAdminOrReadOnly, IsCourseOwnerOrStaff


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        """
        Different rules per action:

        - list/retrieve: any authenticated user (read-only)
        - create: only staff/admin
        - update/partial_update/destroy: owner or staff
        """
        if self.action in ["list", "retrieve"]:
            perms = [IsAuthenticated, IsAdminOrReadOnly]
        elif self.action == "create":
            perms = [IsAuthenticated, IsAdminOrReadOnly]
        elif self.action in ["update", "partial_update", "destroy"]:
            perms = [IsAuthenticated, IsCourseOwnerOrStaff]
        else:
            perms = [IsAuthenticated]

        return [p() for p in perms]

    def perform_create(self, serializer):
        # Attach owner when creating
        serializer.save(owner=self.request.user)


from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})
