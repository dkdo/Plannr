from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from organization.models import Organization
from django.conf import settings

class Reward(models.Model):
    name = models.CharField(max_length=100)
    required_points = models.IntegerField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="organization_reward", null=False)

    class Meta:
        unique_together = ['organization', 'name']

class Employee_Rewards(models.Model):
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE, null=False)
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    needed_points = models.IntegerField()
    emp_points = models.IntegerField()

    class Meta:
        unique_together = ['reward', 'employee']
