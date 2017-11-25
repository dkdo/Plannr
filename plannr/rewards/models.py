from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from organization.models import Organization

class Reward(models.Model):
    name = models.CharField(max_length=100)
    required_points = models.IntegerField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="organization_reward", null=False)

    class Meta:
        unique_together = ['organization', 'name']
