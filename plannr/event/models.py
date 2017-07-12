from __future__ import unicode_literals

from django.db import models

class Event(models.Model):
    title = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    date = models.DateField()

    class Meta:
        ordering = ('created',)
