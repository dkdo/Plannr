# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-10 18:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0001_Add organization model'),
        ('position', '0005_CHANGED_ONETOONE_TO_MANYTOONE_MANAGER'),
    ]

    operations = [
        migrations.AddField(
            model_name='position',
            name='organization',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='organization.Organization'),
            preserve_default=False,
        ),
    ]
