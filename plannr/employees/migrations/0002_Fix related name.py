# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-15 18:17
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0001_Create employee relation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employees',
            name='manager',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='manager', to=settings.AUTH_USER_MODEL),
        ),
    ]
