from django.urls import path
from .views import OrderView, AliPayAPI, ExamAPI

urlpatterns = [
    path('order/', OrderView.as_view()),
    path('alipayreturn/', AliPayAPI.as_view()),
    path('exams/', ExamAPI.as_view())
]
