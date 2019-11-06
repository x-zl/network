# Generated by Django 2.2.6 on 2019-11-06 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0004_examinfo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='examinfo',
            old_name='student_id',
            new_name='ex_id',
        ),
        migrations.RenameField(
            model_name='examinfo',
            old_name='exam_number',
            new_name='ex_type',
        ),
        migrations.RemoveField(
            model_name='examinfo',
            name='exam_addr',
        ),
        migrations.RemoveField(
            model_name='examinfo',
            name='exam_id',
        ),
        migrations.AddField(
            model_name='examinfo',
            name='ex_addr',
            field=models.IntegerField(default=0, verbose_name='考场地点'),
        ),
        migrations.AddField(
            model_name='examinfo',
            name='stu_id',
            field=models.IntegerField(default=0, verbose_name='考生序号'),
        ),
        migrations.AlterField(
            model_name='examinfo',
            name='grade',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
