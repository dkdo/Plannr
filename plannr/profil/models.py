from __future__ import unicode_literals

from django.db import models
from django.conf import settings

# Create your models here.
class Profile(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=50)
	phone_num = models.CharField(max_length=12)
	birth_date = models.DateField()
	status = models.CharField(max_length=140)
