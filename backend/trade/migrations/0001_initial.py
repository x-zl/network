# Generated by Django 2.1.7 on 2019-11-04 16:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_sn', models.CharField(blank=True, help_text='订单号', max_length=30, null=True, unique=True, verbose_name='订单号')),
                ('trade_no', models.CharField(blank=True, max_length=100, null=True, unique=True, verbose_name='支付')),
                ('pay_status', models.CharField(choices=[('success', '成功'), ('cancel', '取消'), ('topaid', '待支付')], help_text='订单状态', max_length=20, verbose_name='订单状态')),
                ('order_amount', models.FloatField(default=0.0, help_text='订单金额', verbose_name='订单金额')),
                ('pay_time', models.DateTimeField(blank=True, help_text='支付时间', null=True, verbose_name='支付时间')),
                ('address', models.CharField(default='', help_text='考场地点', max_length=200, verbose_name='考场地点')),
                ('exam_type', models.CharField(default='', help_text='考试类型', max_length=20, verbose_name='考试类型')),
                ('user', models.ForeignKey(help_text='用户', on_delete=django.db.models.deletion.CASCADE, related_name='order_infos', to=settings.AUTH_USER_MODEL, verbose_name='用户')),
            ],
            options={
                'verbose_name': '订单',
                'verbose_name_plural': '订单',
            },
        ),
    ]