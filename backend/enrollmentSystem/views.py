from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileSerializer,ShowSerializer
from accounts.serializers import UserSerializer, UserSerializerWithToken
from .utils import klog

# /profile
class UserProfileAPI(APIView):
    def get(self, request, **kwargs):
        klog(__name__)
        user = request.user

        # serializer = UserSerializer(user)
        if user.is_authenticated:
            profile_data = user.profile
            klog('authenticated', profile_data)
            profile_serializer = ProfileSerializer(profile_data)
            return Response(profile_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        klog(__name__)
        # serializer = UserSerializer(data=request.user)
        user = request.user
        profile = user.profile
        if user.is_authenticated:
            klog('authenticated', profile)
            profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response(profile_serializer.data)
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def show(self, request, **kwargs):
        user = request.user
        if user.is_authenticated:
            profile_data = user.profile
            profile_serializer = ShowSerializer(profile_data)
            return Response(profile_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
# from rest_framework import viewsets # curd operation
# from .serializers import TodoSerializer
# from .models import Todo

# class TodoView(viewsets.ModelViewSet):
#    serializer_class = TodoSerializer
#    queryset = Todo.objects.all()
