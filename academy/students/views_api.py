from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer

class StudentListCreateAPIView(APIView):
    def get(self, request):
        # List
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print("post called")
        # Create
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # calls create()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            print(f"[APIView] {request.user} updated student {student.id}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.generics import GenericAPIView
from rest_framework import mixins
from .models import Student
from .serializers import StudentSerializer

class StudentListCreateGenericAPIView(mixins.ListModelMixin,
                                     mixins.CreateModelMixin,
                                     GenericAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def perform_create(self, serializer):
        student = serializer.save()
        print(f"[GenericAPIView] {self.request.user} created {student.name}")

    def perform_update(self, serializer):
        student = serializer.save()
        print(f"[GenericAPIView] {self.request.user} updated {student.id}")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)   # from ListModelMixin

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs) # from CreateModelMixin
