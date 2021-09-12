
from rest_framework import generics
from rest_framework.response import Response

from .serializers import ViewCreateTaskListSerializer
from .serializers import TaskListUpdateSerializer
from .serializers import GET_UsersList

from . import permissions

from .models import Task
from django.contrib.auth.models import User

class ViewCreateTaskList(generics.ListCreateAPIView):
    serializer_class=ViewCreateTaskListSerializer

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user.id)

    def create(self,request,*args,**kwargs):
        owner=request.user
        task_data=request.data
        new_task=Task.objects.create(
            title=task_data['title'],
        )
        new_task.owner.add(request.user.id)
        new_task.save()
        serializer=ViewCreateTaskListSerializer(new_task)
        return Response(serializer.data)


class  ViewTaskListUpdate(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=TaskListUpdateSerializer
    permission_classes=(permissions.TaskListEditPermission,)
    queryset=Task.objects.all()


class GET_UsersListView(generics.ListAPIView):
    serializer_class=GET_UsersList
    queryset=User.objects.all()
