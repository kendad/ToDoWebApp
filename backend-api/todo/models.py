from django.db import models
import uuid
from django.contrib.auth.models import User

class Task(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,unique=True,editable=False)
    owner=models.ManyToManyField(User)
    title=models.CharField(max_length=255)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Note(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,unique=True,editable=False)
    owner=models.ForeignKey('Task',on_delete=models.CASCADE)
    title=models.CharField(max_length=255)
    description=models.TextField()
    section=models.ForeignKey('Section',on_delete=models.DO_NOTHING,default=1)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Section(models.Model):
    title=models.CharField(max_length=100)

    def __str__(self):
        return self.title
