from __future__ import unicode_literals
from django.conf import settings
from django.db import models


class Event(models.Model):
    title = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True)
    manager = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, null=True,
                                related_name='manager_event')
    employee = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ('created',)
