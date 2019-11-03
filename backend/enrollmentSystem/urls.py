from django.urls import path
from .views import UserProfileAPI

urlpatterns = [
    path('profile/', UserProfileAPI.as_view()),
]
