# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-03 22:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('position', '0003_Manager_attr_to_position'),
    ]

    operations = [
        migrations.RenameField(
            model_name='position',
            old_name='hourly_salary',
            new_name='salary',
        ),
        migrations.RenameField(
            model_name='position',
            old_name='name',
            new_name='title',
        ),
    ]
