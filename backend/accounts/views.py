from django.http import HttpResponse
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken
import random

import logging

def random_str(randomlength=6):
    str = ''
    chars = 'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    length = len(chars) - 1
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    return str

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def find_password(request):
    print('xxxxxxxx')
    if request.method == 'GET':

        params = request.query_params.dict()
        print('send data', params)
        username = params.get('username', None)
        if username == None:
            return Response({'pay_status': 'no username'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(username=username)
        email = user.email

        title = '[enrollmentSystem] reset password'
        code = random_str()
        #储存code
        user.first_name = code;
        user.save()


        msg = "verify code: {0}".format(code)
        print(code, settings.EMAIL_FROM, email)
        send_status = send_mail(title, msg, settings.EMAIL_FROM, [email])
        print(send_status)
        # print('--test--', request.session['code'])
        # print('--test--', request.session['code'])
        return Response({'send_status': send_status})

    else:
        # POST
        # username = request.data['username']
        username = request.data['username']
        user = User.objects.get(username=username)

        print(request.data)
        new_password = request.data.get('password', None)
        code = request.data.get('code', None)
        print(code, user.first_name)

        if not new_password:
             return Response({'reset_status': 'input new password'})
        if not code:
          return Response({'reset_status': 'input code'})

        # print("----------", request.session['code'] )
        if code == user.first_name:
            user.set_password(new_password)

            user.first_name = ''

            user.save()
            return Response({'reset_status': 'reset success'})
        return Response({'reset_status': 'wrong verify code'})

# accounts/current_users for did mount
@api_view(['GET'])
def current_user(request):
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
