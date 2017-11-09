from __future__ import unicode_literals

from django.db import models

class Position(models.Model):
    name = models.CharField(max_length=100)
    hourly_salary = models.IntegerField()
    department = models.CharField(max_length=100)
