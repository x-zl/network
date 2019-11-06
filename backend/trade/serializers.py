from rest_framework import serializers
import time

from .models import OrderInfo, ExamInfo
"""
class examInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderInfo
        fields = ('exam_number', '')
"""
class OrderInfoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()  # user为隐藏字段，默认为获取当前登录用户
    )

    pay_status = serializers.CharField(read_only=True)
    trade_no = serializers.CharField(read_only=True)
    pay_time = serializers.DateTimeField(read_only=True)

    # order_sn = serializers.SerializerMethodField()
    def generate_trade_no(self, exam_number):
        # from random import Random
        # random_ins = Random()
        # time_str=time.strftime("%Y%m%d%H%M%S")
        # ranstr=random_ins.randint(10, 99)
        suffix = '3298103829253479'
        trade_no = "{exam_number}{userid}{suffix}".format(exam_number=exam_number,
            userid=self.context["request"].user.id, suffix=suffix)
        return trade_no

    def create(self, validated_data):
        print(validated_data)
        user = validated_data.pop('user', None)
        exam_number = validated_data.pop('exam_number', None)
        instance = OrderInfo(
            user = user,
            exam_number = exam_number,
            trade_no = self.generate_trade_no(exam_number)
        )
        # if exam_number is not None:
        instance.save()
        return instance

    class Meta:
        model = OrderInfo
        fields = "__all__"


from rest_framework import serializers
import time

from .models import OrderInfo
"""
class examInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderInfo
        fields = ('exam_number', '')
"""
class OrderInfoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()  # user为隐藏字段，默认为获取当前登录用户
    )

    pay_status = serializers.CharField(read_only=True)
    trade_no = serializers.CharField(read_only=True)
    pay_time = serializers.DateTimeField(read_only=True)

    # order_sn = serializers.SerializerMethodField()
    def generate_trade_no(self, exam_number):
        # from random import Random
        # random_ins = Random()
        # time_str=time.strftime("%Y%m%d%H%M%S")
        # ranstr=random_ins.randint(10, 99)
        suffix = '3298103829253479'
        trade_no = "{exam_number}{userid}{suffix}".format(exam_number=exam_number,
            userid=self.context["request"].user.id, suffix=suffix)
        return trade_no

    def create(self, validated_data):
        print(validated_data)
        user = validated_data.pop('user', None)
        exam_number = validated_data.pop('exam_number', None)
        instance = OrderInfo(
            user = user,
            exam_number = exam_number,
            trade_no = self.generate_trade_no(exam_number)
        )
        # if exam_number is not None:
        instance.save()
        return instance

    class Meta:
        model = OrderInfo
        fields = "__all__"

class ExamSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamInfo
        fields = ('user', 'name', 'exam_id', 'student_id', 'exam_addr', 'exam_number', 'grade')

        
