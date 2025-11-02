from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from api.mongo import col


def _user_doc(user: User):
    return {
        "_id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "student_id": user.student_id,
        "faculty_id": user.faculty_id,
        "phone": user.phone,
        "address": user.address,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


@receiver(post_save, sender=User)
def sync_user_to_mongo(sender, instance: User, **kwargs):
    doc = _user_doc(instance)
    col("users").update_one({"_id": instance.id}, {"$set": doc}, upsert=True)
    if instance.role == "faculty":
        col("faculty").update_one({"_id": instance.id}, {"$set": doc}, upsert=True)
        col("students").delete_one({"_id": instance.id})
    elif instance.role == "student":
        col("students").update_one({"_id": instance.id}, {"$set": doc}, upsert=True)
        col("faculty").delete_one({"_id": instance.id})
    else:
        col("faculty").delete_one({"_id": instance.id})
        col("students").delete_one({"_id": instance.id})


