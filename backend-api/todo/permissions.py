from rest_framework import permissions
from . import models


class TaskListEditPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        the_task=models.Task.objects.get(id=obj.id)
    
        if request.user in the_task.owner.all():
            return True
        else:
            return False

class NoteEditPermission(permissions.BasePermission):

    def has_object_permission(self,request,view,obj):

        the_task=models.Task.objects.get(id=obj.owner.id)

        if request.user in the_task.owner.all():
            return True
        else:
            return False


