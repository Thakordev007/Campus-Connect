from django.urls import path
from . import views

urlpatterns = [
    # Events
    path('events/', views.EventListCreateView.as_view(), name='event_list_create'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    
    # Exams
    path('exams/', views.ExamListCreateView.as_view(), name='exam_list_create'),
    path('exams/<int:pk>/', views.ExamDetailView.as_view(), name='exam_detail'),
    
    # Results
    path('results/', views.ResultListCreateView.as_view(), name='result_list_create'),
    path('results/<int:pk>/', views.ResultDetailView.as_view(), name='result_detail'),
    
    # Study Materials
    path('materials/', views.StudyMaterialListCreateView.as_view(), name='material_list_create'),
    path('materials/<int:pk>/', views.StudyMaterialDetailView.as_view(), name='material_detail'),
    
    # Utility endpoints
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('students/', views.get_students, name='get_students'),
    path('faculty/', views.get_faculty, name='get_faculty'),
    path('messages/', views.post_message, name='post_message'),
]
