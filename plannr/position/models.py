from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class Position(models.Model):
    title = models.CharField(max_length=100)
    salary = models.FloatField()
    department = models.CharField(max_length=100, default='Main')
    manager = models.OneToOneField(User, on_delete=models.CASCADE)
