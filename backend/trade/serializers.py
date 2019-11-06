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
        suffix = '329810382'
        trade_no = "329810382{userid}.{exam_number}".format(userid=self.context["request"].user.id,exam_number=exam_number)
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
        fields = ('user', 'name', 'stu_id', 'ex_id', 'ex_addr', 'ex_type', 'grade')

        
