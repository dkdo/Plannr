# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-27 21:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rewards', '0002_CREATED_REWARD_EMPLOYEE_RELATION'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee_rewards',
            old_name='points',
            new_name='emp_points',
        ),
        migrations.AddField(
            model_name='employee_rewards',
            name='needed_points',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
