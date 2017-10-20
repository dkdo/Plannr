from __future__ import unicode_literals

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
	user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=50)
	phone_num = models.CharField(max_length=12)
	birth_date = models.CharField(max_length=11)
	status = models.CharField(max_length=140)
