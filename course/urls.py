from django.urls import path
from .views import CourseDetail, CourseList, index, course, course_detail

urlpatterns = [
    path('', index.as_view(), name='index'),
    path('courses/', course.as_view(), name='course'),
    path('courses/<str:pk>/', course_detail.as_view(), name='course_detail'),
    path('api/courses/', CourseList.as_view(), name='course-list'),
    path('api/courses/<str:pk>/', CourseDetail.as_view(), name='course-detail'),
]