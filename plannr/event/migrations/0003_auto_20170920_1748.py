# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-09-20 17:48
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_auto_20170913_1628'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='date',
            new_name='start_date',
        ),
    ]
