from django.contrib import admin
from .models import Event, Exam, Result, StudyMaterial


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'created_by', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'created_by__role')
    search_fields = ('title', 'description', 'location', 'created_by__username')
    ordering = ('-date',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'date', 'faculty', 'is_active', 'created_at')
    list_filter = ('is_active', 'subject', 'created_at', 'faculty__role')
    search_fields = ('title', 'description', 'subject', 'faculty__username')
    ordering = ('-date',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'total_marks', 'grade', 'created_at')
    list_filter = ('grade', 'created_at', 'exam__subject', 'exam__faculty')
    search_fields = ('student__username', 'student__first_name', 'exam__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'grade')


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'material_type', 'subject', 'uploaded_by', 'is_active', 'created_at')
    list_filter = ('material_type', 'is_active', 'subject', 'created_at', 'uploaded_by__role')
    search_fields = ('title', 'description', 'subject', 'uploaded_by__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'file_size')
