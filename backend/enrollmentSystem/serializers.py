from rest_framework import serializers

from django.contrib.auth.models import User

from accounts.serializers import UserSerializer
from .models import Todo, Profile

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')

class ProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('user', 'name', 'major', 'school', 'IDCard', 'phone_number')

#考前信息确认
class ShowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('name', 'sex', 'major', 'school', 'IDCard', 'phone_number')

# change
class UserProfileCreateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    def update(self, instance, validated_data):
        # we need to update nested serializer for Profile
        if validated_data.get('profile'):
            profile_data = validated_data.get('profile')
            profile_serializer = ProfileSerializer(data=profile_data)

            if profile_serializer.is_valid():
                profile = profile_serializer.update(instance=instance.profile)
                validated_data['profile'] = profile

        return super(UserSerializer, self).update(instance, validated_data)

    class Meta:
        model = User
        fields = ('username', 'email', 'profile')
