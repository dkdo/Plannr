# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-10 17:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0001_Add organization model'),
        ('profil', '0002_CHANGED_PROFIL_MODEL_ISMANAGER_NAME'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='organization',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='organization.Organization'),
        ),
    ]
