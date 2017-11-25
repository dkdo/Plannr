from __future__ import unicode_literals
from django.conf import settings
from django.db import models

class Stat(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE)
    hours = models.FloatField(default=0.0)
    shifts = models.IntegerField(default=0)
    taken_shifts = models.IntegerField(default=0)
    given_shifts = models.IntegerField(default=0)
    total = models.FloatField(default=0)
