# Generated by Django 2.1.7 on 2019-11-02 09:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('enrollmentSystem', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='IDcard',
            new_name='IDCard',
        ),
    ]