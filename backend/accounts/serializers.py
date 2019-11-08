from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User


# log in
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)

# sign up
class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    # read_only=true 表示只能用于api的输出，不会进行验证
    # 例如 支付状态，交易号，订单号，支付时间
    # write_only = true 表示后台处理后不会经过序列化返回给客户端
    # 例如 验证码，密码
    """
    password = serializers.CharField(
        write_only=True,
        label="密码",
        max_length=64
    );
    email = serializers.CharField(
        write_only=True,
        label="邮箱",
        max_length=64
    );
    username = serializers.CharField(
        help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
        max_length=150,
        required=True,
        allow_blank=False,
        label="用户名",
        validators=[UniqueValidator(queryset=User.objects.all(), message="用户已存在")]
    );
    """

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        print("----sign up data----")
        print(validated_data)
        email = validated_data.pop('email', None)
        print(email)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        if email is not None:
            instance.email = email
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password', 'email')
