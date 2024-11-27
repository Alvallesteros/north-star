from django.urls import path
from .views import MajorDetail, MajorList, CareerList, CareerDetail, careerList, careerDetail, majorList, majorDetail, Top5CareersPerMajor

urlpatterns = [
        path('careers/', careerList.as_view(), name='career-list'),
        path('careers/<str:pk>/', careerDetail.as_view(), name='career-detail'),
        path('majors/', majorList.as_view(), name='major-list'),
        path('majors/<str:pk>/', majorDetail.as_view(), name='major-detail'),
        path('api/majors/', MajorList.as_view(), name='major-list'),
        path('api/majors/<str:pk>/', MajorDetail.as_view(), name='major-detail'),
        path('api/majors/<str:pk>/top5/', Top5CareersPerMajor.as_view(), name='top5-careers-per-major'),
        path('api/careers/', CareerList.as_view(), name='career-list'),
        path('api/careers/<str:pk>/', CareerDetail.as_view(), name='career-detail'),
]