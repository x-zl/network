from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # write read
    name = models.CharField(null=True, max_length=50)
    sex = models.CharField(null=True, max_length=50)
    major = models.CharField(null=True, blank=True, max_length=100)
    school = models.CharField(null=True, blank=True, max_length=100)
    IDCard = models.CharField(null=True, unique=True, max_length=50)
    phone_number = models.CharField(null=True, blank=True, max_length=10)
    birth_date = models.DateField(null=True, blank=True)
    # read_only
    ex_addr = models.CharField(null=True, blank=True, max_length=100)#考试地点
    if_test = models.BooleanField(default=False) #是否有要参加的考试，报名后置1
    grade = models.PositiveIntegerField(null=True)
    pay_status = models.BooleanField(default=False)
    pay_num = models.CharField(null=True, blank=True, max_length=100)#考试费订单号，用于查询
    
    def __str__(self):
        return f'{self.user.username}'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

#  three properties on the Todo model:
#  title, description, completed
class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
