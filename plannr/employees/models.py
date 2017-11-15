from __future__ import unicode_literals
from django.conf import settings
from django.db import models


class Employees(models.Model):
    employee = models.OneToOneField(settings.AUTH_USER_MODEL,
                                    on_delete=models.CASCADE, primary_key=True)
    manager = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, null=False,
                                related_name='manager')

    class Meta:
        unique_together = ['manager', 'employee']
