# Generated by Django 2.0.2 on 2018-04-18 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kro', '0010_meetingprogressnotes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meetingprogressnotes',
            name='meeting_notes',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='meetingprogressnotes',
            name='post_meeting_notes',
            field=models.TextField(blank=True),
        ),
    ]
