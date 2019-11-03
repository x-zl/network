from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken

import logging

# accounts/current_users for did mount
@api_view(['GET'])
def current_user(request):
    logger = logger = logging.getLogger(__name__);
    logger.debug("current_user", request);
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# accounts/users for sign up
class UserList(APIView):

    permission_classes = (permissions.AllowAny,)
    # create / update database
    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data) #json
        if serializer.is_valid():
            serializer.save() #调用 create或update
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
