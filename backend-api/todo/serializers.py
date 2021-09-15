from django.db.models import fields
from rest_framework import serializers

from .models import Task
from .models import Note
from django.contrib.auth.models import User

from todo import models

##########
'''TASK'''
class ViewCreateTaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=('id','title')

class TaskListUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=('owner','title')

##########
"""Note"""
class ViewCreateNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Note
        fields=('id','title','description','section')

class NoteUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Note
        fields=('id','title','description','section')

#########
'''GET'''
class GET_UsersList(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('id','username')

class GET_Section(serializers.ModelSerializer):
    class Meta:
        model=models.Section
        fields=('id','title')
