from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class OrderInfo(models.Model):

    ORDER_STATUS = (
        ('success', '成功'),
        ('closed', '未付款交易超时'),
        ('cancel', '取消'),
        ('finished', '结束'),
        ('unpaid', '待支付'),
    )

    user = models.ForeignKey(User, verbose_name='用户', help_text='用户', on_delete=models.CASCADE, related_name='order_infos')
    # order_sn = models.CharField(max_length=30, unique=True, blank=True, null=True, verbose_name='订单号', help_text='订单号')
    # 主键
    trade_no = models.CharField(primary_key=True, max_length=100, unique=True, null=False, blank=True, verbose_name='支付')

    pay_status = models.CharField(choices=ORDER_STATUS, default='unpaid', max_length=20, verbose_name='订单状态', help_text='订单状态')
    # order_amount = models.FloatField(default=0.0, verbose_name='订单金额', help_text='订单金额')
    # 固定生成
    pay_time = models.DateTimeField(null=True, blank=True, verbose_name='支付时间', help_text='支付时间')
    # exam_id = models.CharField(unique=True, null=True, blank=True, verbose_name='考场号', help_text='考场号')
    # student_id = models.CharField(unique=True, null=True, blank=True, verbose_name='考生号', help_text='考生号')
    # post
    # location = models.CharField(max_length=200, default='', verbose_name='考场地点', help_text='考场地点')
    exam_number = models.CharField(max_length=20, default='', verbose_name='考试类型', help_text='考试类型')

    class Meta:
        verbose_name_plural = verbose_name = '订单'

    def __str__(self):
        return "{}".format(self.trade_no)



class ExamInfo(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 考生姓名 对应用户profile的姓名，为了减少查询 直接生成
    name = models.CharField(null=True, blank=True, max_length=50)
    IDCard = models.CharField(null=True, blank=True, max_length=50)
    # 考生序号为该类型考试的上一个考生加1
    student_id = models.IntegerField(verbose_name='考生序号', blank=True, default=0)
    exam_id = models.CharField(max_length=20,  null=True, blank=True, verbose_name='考号', help_text='考生号')

    # 考场号由该类型考试的考生序号%30+1按顺序对应到考场 直接生成
    class_number = models.IntegerField(default=0, blank=True, verbose_name='考场号')

    exam_number = models.CharField(max_length=20, blank=True, default='', verbose_name='考试类型', help_text='考试类型')

    # 创建时为一个不可能的成绩 比如0
    grade = models.IntegerField(blank=True, default=0)

    class Meta:
        verbose_name_plural = verbose_name = '考试信息'

    def __str__(self):
        return "{}".format(self.name)
