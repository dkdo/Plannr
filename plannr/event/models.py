from __future__ import unicode_literals
from datetime import timedelta

from django.db import models

class Event(models.Model):
    title = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True)

    class Meta:
        ordering = ('created',)
