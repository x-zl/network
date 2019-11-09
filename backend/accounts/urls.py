from django.urls import path
from .views import current_user, UserList, find_password

urlpatterns = [
    path('current_user/', current_user),
    path('reset/', find_password),
    path('users/', UserList.as_view())
]
