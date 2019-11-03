from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Profile

class ProflieInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = '_Profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (ProflieInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(UserAdmin, self).get_inline_instances(request, obj)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)


# Register your models here.
#from .models import Todo

#class TodoAdmin(admin.ModelAdmin):
#    list_display = ('title', 'description', 'completed')

#admin.site.register(Todo, TodoAdmin)
