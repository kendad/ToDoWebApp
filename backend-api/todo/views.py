
from rest_framework import generics
from rest_framework.response import Response

from .serializers import ViewCreateTaskListSerializer
from .serializers import TaskListUpdateSerializer

from .serializers import ViewCreateNoteSerializer
from .serializers import NoteUpdateSerializer

from .serializers import GET_UsersList
from .serializers import GET_Section

from . import permissions

from .models import Task
from .models import Section
from .models import Note
from django.contrib.auth.models import User

##########
'''TASK'''
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

##########
'''Note'''
class ViewCreateNote(generics.ListCreateAPIView):
    serializer_class=ViewCreateNoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.kwargs.get('taskID'))
    
    def create(self,request,*args,**kwargs):
        owner_id=self.kwargs.get('taskID')
        note_data=request.data
        new_note=Note.objects.create(
            title=note_data['title'],
            description=note_data['description'],
            owner=Task.objects.get(id=owner_id)
        )
        new_note.save()
        serializer=ViewCreateNoteSerializer(new_note)
        return Response(serializer.data)

class ViewUpdateNote(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=NoteUpdateSerializer
    permission_classes=(permissions.NoteEditPermission,)
    queryset=Note.objects.all()


#########
'''GET'''
class GET_UsersListView(generics.ListAPIView):
    serializer_class=GET_UsersList
    queryset=User.objects.all()

class GET_SectionView(generics.ListAPIView):
    serializer_class=GET_Section
    queryset=Section.objects.all()