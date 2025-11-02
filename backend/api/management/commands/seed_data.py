from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
from api.models import Event, Exam, Result, StudyMaterial
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed database...')
        
        # Create users
        self.create_users()
        
        # Create events
        self.create_events()
        
        # Create exams
        self.create_exams()
        
        # Create results
        self.create_results()
        
        # Create study materials
        self.create_study_materials()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with sample data!')
        )

    def create_users(self):
        """Create sample users"""
        # Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@campusconnect.edu',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user')

        # Faculty users
        faculty_data = [
            ('john_doe', 'john.doe@campusconnect.edu', 'John', 'Doe', 'FAC001'),
            ('jane_smith', 'jane.smith@campusconnect.edu', 'Jane', 'Smith', 'FAC002'),
            ('mike_wilson', 'mike.wilson@campusconnect.edu', 'Mike', 'Wilson', 'FAC003'),
        ]
        
        for username, email, first_name, last_name, faculty_id in faculty_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'faculty',
                    'faculty_id': faculty_id,
                }
            )
            if created:
                user.set_password('faculty123')
                user.save()
                self.stdout.write(f'Created faculty user: {username}')

        # Student users
        student_data = [
            ('alice_johnson', 'alice.johnson@campusconnect.edu', 'Alice', 'Johnson', 'STU001'),
            ('bob_brown', 'bob.brown@campusconnect.edu', 'Bob', 'Brown', 'STU002'),
            ('carol_davis', 'carol.davis@campusconnect.edu', 'Carol', 'Davis', 'STU003'),
            ('david_miller', 'david.miller@campusconnect.edu', 'David', 'Miller', 'STU004'),
            ('eve_wilson', 'eve.wilson@campusconnect.edu', 'Eve', 'Wilson', 'STU005'),
        ]
        
        for username, email, first_name, last_name, student_id in student_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'student',
                    'student_id': student_id,
                }
            )
            if created:
                user.set_password('student123')
                user.save()
                self.stdout.write(f'Created student user: {username}')

    def create_events(self):
        """Create sample events"""
        faculty_users = User.objects.filter(role='faculty')
        admin_user = User.objects.get(username='admin')
        
        events_data = [
            {
                'title': 'Welcome Orientation 2024',
                'description': 'Welcome new students to our campus community. Learn about campus facilities, academic programs, and student life.',
                'date': timezone.now() + timedelta(days=7),
                'location': 'Main Auditorium',
                'created_by': admin_user,
            },
            {
                'title': 'Science Fair 2024',
                'description': 'Annual science fair showcasing student projects and research. Open to all students and faculty.',
                'date': timezone.now() + timedelta(days=14),
                'location': 'Science Building',
                'created_by': faculty_users[0],
            },
            {
                'title': 'Career Guidance Workshop',
                'description': 'Workshop on career planning, resume building, and interview skills for graduating students.',
                'date': timezone.now() + timedelta(days=21),
                'location': 'Career Center',
                'created_by': faculty_users[1],
            },
            {
                'title': 'Cultural Festival',
                'description': 'Annual cultural festival celebrating diversity and traditions from around the world.',
                'date': timezone.now() + timedelta(days=30),
                'location': 'Campus Grounds',
                'created_by': admin_user,
            },
        ]
        
        for event_data in events_data:
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults=event_data
            )
            if created:
                self.stdout.write(f'Created event: {event.title}')

    def create_exams(self):
        """Create sample exams"""
        faculty_users = User.objects.filter(role='faculty')
        
        exams_data = [
            {
                'title': 'Mathematics Midterm',
                'description': 'Midterm examination covering calculus and algebra topics.',
                'date': timezone.now() + timedelta(days=10),
                'subject': 'Mathematics',
                'faculty': faculty_users[0],
            },
            {
                'title': 'Physics Final',
                'description': 'Final examination covering mechanics, thermodynamics, and electromagnetism.',
                'date': timezone.now() + timedelta(days=20),
                'subject': 'Physics',
                'faculty': faculty_users[1],
            },
            {
                'title': 'Computer Science Quiz',
                'description': 'Quiz on programming fundamentals and data structures.',
                'date': timezone.now() + timedelta(days=5),
                'subject': 'Computer Science',
                'faculty': faculty_users[2],
            },
        ]
        
        for exam_data in exams_data:
            exam, created = Exam.objects.get_or_create(
                title=exam_data['title'],
                defaults=exam_data
            )
            if created:
                self.stdout.write(f'Created exam: {exam.title}')

    def create_results(self):
        """Create sample results"""
        students = User.objects.filter(role='student')
        exams = Exam.objects.all()
        
        for exam in exams:
            for student in students:
                # Create results for some students (not all)
                if random.choice([True, False]):
                    marks_obtained = random.randint(60, 95)
                    total_marks = 100
                    remarks = random.choice([
                        'Excellent work!',
                        'Good performance',
                        'Satisfactory',
                        'Needs improvement',
                        'Outstanding!'
                    ])
                    
                    result, created = Result.objects.get_or_create(
                        exam=exam,
                        student=student,
                        defaults={
                            'marks_obtained': marks_obtained,
                            'total_marks': total_marks,
                            'remarks': remarks,
                        }
                    )
                    if created:
                        self.stdout.write(f'Created result for {student.username} in {exam.title}')

    def create_study_materials(self):
        """Create sample study materials"""
        faculty_users = User.objects.filter(role='faculty')
        
        materials_data = [
            {
                'title': 'Calculus Lecture Notes - Chapter 1',
                'description': 'Comprehensive notes covering limits and continuity in calculus.',
                'material_type': 'lecture_notes',
                'subject': 'Mathematics',
                'uploaded_by': faculty_users[0],
            },
            {
                'title': 'Physics Lab Manual',
                'description': 'Complete lab manual for physics experiments and procedures.',
                'material_type': 'reference',
                'subject': 'Physics',
                'uploaded_by': faculty_users[1],
            },
            {
                'title': 'Programming Assignment 1',
                'description': 'Assignment on basic programming concepts and problem solving.',
                'material_type': 'assignment',
                'subject': 'Computer Science',
                'uploaded_by': faculty_users[2],
            },
            {
                'title': 'Academic Calendar 2024',
                'description': 'Complete academic calendar with important dates and deadlines.',
                'material_type': 'syllabus',
                'subject': 'General',
                'uploaded_by': faculty_users[0],
            },
        ]
        
        for material_data in materials_data:
            material, created = StudyMaterial.objects.get_or_create(
                title=material_data['title'],
                defaults=material_data
            )
            if created:
                self.stdout.write(f'Created study material: {material.title}')
