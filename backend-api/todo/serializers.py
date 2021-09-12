from django.db.models import fields
from rest_framework import serializers

from .models import Task
from django.contrib.auth.models import User

from todo import models

class ViewCreateTaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=('id','title')

class TaskListUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=('owner','title')

class GET_UsersList(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('id','username')
