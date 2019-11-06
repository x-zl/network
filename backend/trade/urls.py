from django.urls import path
from .views import OrderView, AliPayAPI

urlpatterns = [
    path('order/', OrderView.as_view()),
    path('alipayreturn', AliPayAPI.as_view()),
]
