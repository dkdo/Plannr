# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-11-25 17:21
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('organization', '0002_Modify org name to be unique'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reward',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('required_points', models.IntegerField()),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organization_reward', to='organization.Organization')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='reward',
            unique_together=set([('organization', 'name')]),
        ),
    ]