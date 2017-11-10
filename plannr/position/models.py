from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from organization.models import Organization

class Position(models.Model):
    title = models.CharField(max_length=100)
    salary = models.FloatField()
    department = models.CharField(max_length=100, default='Main')
    manager = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
