from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Event, Exam, Result, StudyMaterial
from .serializers import (
    EventSerializer, EventCreateSerializer,
    ExamSerializer, ExamCreateSerializer,
    ResultSerializer, ResultCreateSerializer,
    StudyMaterialSerializer, StudyMaterialCreateSerializer,
    UserBasicSerializer
)
from .permissions import IsAdminOrReadOnly, IsFacultyOrAdmin, IsFacultyOrAdminOrReadOnly, IsOwnerOrAdmin, IsStudentOrReadOnly
from accounts.models import User
from api.mongo import col
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings


# Event Views
class EventListCreateView(generics.ListCreateAPIView):
    """
    List all events or create a new event
    """
    queryset = Event.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated, IsFacultyOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['created_by']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventSerializer
    
    def get_queryset(self):
        # Students can only see active events
        if self.request.user.is_student:
            return Event.objects.filter(is_active=True)
        # Faculty and Admin can see all events
        return Event.objects.all()


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an event
    """
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EventCreateSerializer
        return EventSerializer


# Exam Views
class ExamListCreateView(generics.ListCreateAPIView):
    """
    List all exams or create a new exam
    """
    queryset = Exam.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated, IsFacultyOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['faculty', 'subject']
    search_fields = ['title', 'description', 'subject']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ExamCreateSerializer
        return ExamSerializer
    
    def get_queryset(self):
        # Students can only see active exams
        if self.request.user.is_student:
            return Exam.objects.filter(is_active=True)
        # Faculty can see their own exams and all if admin
        elif self.request.user.is_faculty and not self.request.user.is_admin:
            return Exam.objects.filter(faculty=self.request.user)
        # Admin can see all exams
        return Exam.objects.all()


class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an exam
    """
    queryset = Exam.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ExamCreateSerializer
        return ExamSerializer


# Result Views
class ResultListCreateView(generics.ListCreateAPIView):
    """
    List all results or create a new result
    """
    queryset = Result.objects.all()
    permission_classes = [IsAuthenticated, IsFacultyOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['exam', 'student', 'grade']
    search_fields = ['student__username', 'student__first_name', 'student__last_name', 'exam__title']
    ordering_fields = ['created_at', 'marks_obtained']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResultCreateSerializer
        return ResultSerializer
    
    def get_queryset(self):
        # Students can only see their own results
        if self.request.user.is_student:
            return Result.objects.filter(student=self.request.user)
        # Faculty can see results for their exams
        elif self.request.user.is_faculty and not self.request.user.is_admin:
            return Result.objects.filter(exam__faculty=self.request.user)
        # Admin can see all results
        return Result.objects.all()


class ResultDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a result
    """
    queryset = Result.objects.all()
    permission_classes = [IsAuthenticated, IsStudentOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ResultCreateSerializer
        return ResultSerializer


# Study Material Views
class StudyMaterialListCreateView(generics.ListCreateAPIView):
    """
    List all study materials or create a new study material
    """
    queryset = StudyMaterial.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated, IsFacultyOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['uploaded_by', 'material_type', 'subject']
    search_fields = ['title', 'description', 'subject']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudyMaterialCreateSerializer
        return StudyMaterialSerializer
    
    def get_queryset(self):
        # Students can only see active materials
        if self.request.user.is_student:
            return StudyMaterial.objects.filter(is_active=True)
        # Faculty can see their own materials and all if admin
        elif self.request.user.is_faculty and not self.request.user.is_admin:
            return StudyMaterial.objects.filter(uploaded_by=self.request.user)
        # Admin can see all materials
        return StudyMaterial.objects.all()


class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a study material
    """
    queryset = StudyMaterial.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return StudyMaterialCreateSerializer
        return StudyMaterialSerializer


# Utility Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics based on user role
    """
    user = request.user
    
    if user.is_admin:
        stats = {
            'total_events': Event.objects.count(),
            'total_exams': Exam.objects.count(),
            'total_results': Result.objects.count(),
            'total_materials': StudyMaterial.objects.count(),
            'total_users': User.objects.count(),
        }
    elif user.is_faculty:
        stats = {
            'my_events': Event.objects.filter(created_by=user).count(),
            'my_exams': Exam.objects.filter(faculty=user).count(),
            'my_results': Result.objects.filter(exam__faculty=user).count(),
            'my_materials': StudyMaterial.objects.filter(uploaded_by=user).count(),
        }
    else:  # student
        stats = {
            'my_results': Result.objects.filter(student=user).count(),
            'available_events': Event.objects.filter(is_active=True).count(),
            'available_exams': Exam.objects.filter(is_active=True).count(),
            'available_materials': StudyMaterial.objects.filter(is_active=True).count(),
        }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_students(request):
    """
    Get list of students for dropdowns
    """
    students = User.objects.filter(role='student').order_by('first_name', 'last_name')
    serializer = UserBasicSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_faculty(request):
    """
    Get list of faculty for dropdowns
    """
    faculty = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
    serializer = UserBasicSerializer(faculty, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_message(request):
    payload = request.data or {}
    doc = {
        "user_id": request.user.id,
        "username": request.user.username,
        "role": request.user.role,
        "message": payload.get("message", ""),
        "meta": payload.get("meta", {}),
        "created_at": timezone.now(),
    }
    res = col("messages").insert_one(doc)
    
    # Send email notification to admin
    try:
        # Get contact details from meta
        meta = payload.get("meta", {})
        subject = meta.get("subject", "New Contact Form Submission")
        firstName = meta.get("firstName", "")
        lastName = meta.get("lastName", "")
        email = meta.get("email", "")
        message = payload.get("message", "")
        
        # Create email content
        email_subject = f"Contact Form: {subject}"
        email_message = f"""
New contact form submission from Campus Connect:

Name: {firstName} {lastName}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent through the Campus Connect contact form.
        """
        
        # Send email to admin (you can change this email address)
        admin_email = ""  # ⚠️ CHANGE THIS TO YOUR EMAIL ADDRESS
        send_mail(
            email_subject,
            email_message,
            settings.DEFAULT_FROM_EMAIL,
            [admin_email],
            fail_silently=False,
        )
        
    except Exception as e:
        print(f"Error sending email: {e}")
        # Don't fail the request if email fails
    
    return Response({"inserted_id": str(res.inserted_id)})
