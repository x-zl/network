from rest_framework import serializers
import time

from .models import OrderInfo, ExamInfo

class examInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamInfo
        fields = ('name', 'IDCard', 'student_id', 'exam_id', 'class_number', 'exam_number', 'grade')


class OrderInfoSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()  # user为隐藏字段，默认为获取当前登录用户
    )

    pay_status = serializers.CharField(read_only=True)
    trade_no = serializers.CharField(read_only=True)
    pay_time = serializers.DateTimeField(read_only=True)



    def generate_trade_no(self, exam_number):
        suffix = '3298103822'
        trade_no = "{suffix}{exam_number}{userid}".format(suffix=suffix, exam_number=exam_number,
            userid=self.context["request"].user.id)
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
