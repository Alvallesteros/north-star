from django.urls import path
from .views import SkillList, SkillDetail, UserList, UserDetail, GetSkillGaps, skillList, skillDetail, userList, userDetail

urlpatterns = [
        path('skills/', skillList.as_view(), name='skill-list'),
        path('skills/<str:pk>/', skillDetail.as_view(), name='skill-detail'),
        path('users/', userList.as_view(), name='user-list'),
        path('users/<str:pk>/', userDetail.as_view(), name='user-detail'),
        path('api/skills/', SkillList.as_view(), name='skill-list'),
        path('api/skills/<str:pk>/', SkillDetail.as_view(), name='skill-detail'),
        path('api/users/', UserList.as_view(), name='user-list'),
        path('api/users/<str:pk>/', UserDetail.as_view(), name='user-detail'),
        path('api/users/<str:pk>/skill_gaps/', GetSkillGaps.as_view(), name='get-skill-gaps')
]