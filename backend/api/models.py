from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Event(models.Model):
    """
    Event model for campus events
    """
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date']
        db_table = 'events'
    
    def __str__(self):
        return self.title


class Exam(models.Model):
    """
    Exam model for campus exams
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    subject = models.CharField(max_length=100)
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_exams')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date']
        db_table = 'exams'
    
    def __str__(self):
        return self.title


class Result(models.Model):
    """
    Result model for exam results
    """
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    total_marks = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    grade = models.CharField(max_length=2, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['exam', 'student']
        ordering = ['-created_at']
        db_table = 'results'
    
    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"
    
    def save(self, *args, **kwargs):
        # Calculate percentage and grade
        if self.total_marks > 0:
            percentage = (self.marks_obtained / self.total_marks) * 100
            if percentage >= 90:
                self.grade = 'A+'
            elif percentage >= 80:
                self.grade = 'A'
            elif percentage >= 70:
                self.grade = 'B+'
            elif percentage >= 60:
                self.grade = 'B'
            elif percentage >= 50:
                self.grade = 'C'
            else:
                self.grade = 'F'
        super().save(*args, **kwargs)


class StudyMaterial(models.Model):
    """
    Study Material model for file uploads
    """
    MATERIAL_TYPE_CHOICES = [
        ('lecture_notes', 'Lecture Notes'),
        ('assignment', 'Assignment'),
        ('reference', 'Reference Material'),
        ('syllabus', 'Syllabus'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPE_CHOICES, default='other')
    file = models.FileField(upload_to='study_materials/')
    subject = models.CharField(max_length=100, blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_materials')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        db_table = 'study_materials'
    
    def __str__(self):
        return self.title
    
    @property
    def file_size(self):
        """Return file size in KB"""
        if self.file:
            return round(self.file.size / 1024, 2)
        return 0
