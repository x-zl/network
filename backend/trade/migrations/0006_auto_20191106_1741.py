# Generated by Django 2.2.6 on 2019-11-06 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trade', '0005_auto_20191106_1604'),
    ]

    operations = [
        migrations.AlterField(
            model_name='examinfo',
            name='name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
