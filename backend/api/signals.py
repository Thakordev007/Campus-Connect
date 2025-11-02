from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Event, Exam, Result, StudyMaterial
from api.mongo import col


@receiver(post_save, sender=Event)
def sync_event(sender, instance: Event, **kwargs):
    col("events").update_one(
        {"_id": instance.id},
        {"$set": {
            "title": instance.title,
            "description": instance.description,
            "date": instance.date,
            "location": instance.location,
            "created_by_id": instance.created_by_id,
            "created_at": instance.created_at,
            "updated_at": instance.updated_at,
            "is_active": instance.is_active,
        }},
        upsert=True,
    )


@receiver(post_save, sender=Exam)
def sync_exam(sender, instance: Exam, **kwargs):
    col("exams").update_one(
        {"_id": instance.id},
        {"$set": {
            "title": instance.title,
            "description": instance.description,
            "date": instance.date,
            "subject": instance.subject,
            "faculty_id": instance.faculty_id,
            "created_at": instance.created_at,
            "updated_at": instance.updated_at,
            "is_active": instance.is_active,
        }},
        upsert=True,
    )


@receiver(post_save, sender=Result)
def sync_result(sender, instance: Result, **kwargs):
    col("results").update_one(
        {"_id": instance.id},
        {"$set": {
            "exam_id": instance.exam_id,
            "student_id": instance.student_id,
            "marks_obtained": float(instance.marks_obtained),
            "total_marks": float(instance.total_marks),
            "grade": instance.grade,
            "created_at": instance.created_at,
            "updated_at": instance.updated_at,
        }},
        upsert=True,
    )


@receiver(post_save, sender=StudyMaterial)
def sync_material(sender, instance: StudyMaterial, **kwargs):
    try:
        file_url = instance.file.url
    except Exception:
        file_url = None
    col("materials").update_one(
        {"_id": instance.id},
        {"$set": {
            "title": instance.title,
            "description": instance.description,
            "material_type": instance.material_type,
            "subject": instance.subject,
            "uploaded_by_id": instance.uploaded_by_id,
            "file": file_url,
            "file_size_kb": instance.file_size,
            "created_at": instance.created_at,
            "updated_at": instance.updated_at,
            "is_active": instance.is_active,
        }},
        upsert=True,
    )


