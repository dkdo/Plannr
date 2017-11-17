from __future__ import unicode_literals
from django.conf import settings
from django.db import models
from event.models import Event
from organization.models import Organization


class Shift(models.Model):
    shift = models.OneToOneField(Event, blank=False)
    interested_emp = models.ForeignKey(settings.AUTH_USER_MODEL, null=True,
                                       default=None)
    searching = models.BooleanField(default=False)
    manager_approved = models.BooleanField(default=False)
    organization = models.ForeignKey(Organization, blank=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('created',)
