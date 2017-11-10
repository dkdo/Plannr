from __future__ import unicode_literals
from django.db import models


class Organization(models.Model):
    organization_name = models.TextField(null=False, unique=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)
