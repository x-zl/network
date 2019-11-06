from django.db import models
from django.contrib.auth.models import User
from alipay import AliPay

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
    trade_no = models.CharField(max_length=100, unique=True, null=True, blank=True, verbose_name='支付')

    pay_status = models.CharField(choices=ORDER_STATUS, default='unpaid', max_length=20, verbose_name='订单状态', help_text='订单状态')
    # order_amount = models.FloatField(default=0.0, verbose_name='订单金额', help_text='订单金额')
    pay_time = models.DateTimeField(null=True, blank=True, verbose_name='支付时间', help_text='支付时间')
    # post
    # location = models.CharField(max_length=200, default='', verbose_name='考场地点', help_text='考场地点')
    exam_number = models.CharField(max_length=20, default='', verbose_name='考试类型', help_text='考试类型')
    # signer_mobile = models.CharField(max_length=11, verbose_name='联系电话', help_text='联系电话')

    class Meta:
        verbose_name_plural = verbose_name = '订单'

    def __str__(self):
        return "{}".format(self.trade_no)