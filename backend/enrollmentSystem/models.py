from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # write read
    name = models.CharField(null=True, max_length=50)
    major = models.CharField(null=True, blank=True, max_length=100)
    school = models.CharField(null=True, blank=True, max_length=100)
    IDCard = models.CharField(null=True, unique=True, max_length=50)
    phone_number = models.CharField(null=True, blank=True, max_length=10)
    birth_date = models.DateField(null=True, blank=True)

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
