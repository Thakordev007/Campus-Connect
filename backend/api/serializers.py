from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Event, Exam, Result, StudyMaterial

User = get_user_model()


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for Event model
    """
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')


class EventCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating events
    """
    class Meta:
        model = Event
        fields = ('title', 'description', 'date', 'location')
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ExamSerializer(serializers.ModelSerializer):
    """
    Serializer for Exam model
    """
    faculty_name = serializers.CharField(source='faculty.get_full_name', read_only=True)
    faculty_username = serializers.CharField(source='faculty.username', read_only=True)
    
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('faculty', 'created_at', 'updated_at')


class ExamCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating exams
    """
    class Meta:
        model = Exam
        fields = ('title', 'description', 'date', 'subject')
    
    def create(self, validated_data):
        validated_data['faculty'] = self.context['request'].user
        return super().create(validated_data)


class ResultSerializer(serializers.ModelSerializer):
    """
    Serializer for Result model
    """
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'grade')
    
    def get_percentage(self, obj):
        if obj.total_marks > 0:
            return round((obj.marks_obtained / obj.total_marks) * 100, 2)
        return 0


class ResultCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating results
    """
    class Meta:
        model = Result
        fields = ('exam', 'student', 'marks_obtained', 'total_marks', 'remarks')
    
    def validate(self, attrs):
        exam = attrs.get('exam')
        student = attrs.get('student')
        
        # Check if student is actually a student
        if not student.is_student:
            raise serializers.ValidationError("Selected user is not a student")
        
        # Check if result already exists
        if Result.objects.filter(exam=exam, student=student).exists():
            raise serializers.ValidationError("Result for this student and exam already exists")
        
        return attrs


class StudyMaterialSerializer(serializers.ModelSerializer):
    """
    Serializer for Study Material model
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_size = serializers.ReadOnlyField()
    
    class Meta:
        model = StudyMaterial
        fields = '__all__'
        read_only_fields = ('uploaded_by', 'created_at', 'updated_at')


class StudyMaterialCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating study materials
    """
    class Meta:
        model = StudyMaterial
        fields = ('title', 'description', 'material_type', 'file', 'subject')
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class UserBasicSerializer(serializers.ModelSerializer):
    """
    Basic user serializer for dropdowns and references
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'role')
