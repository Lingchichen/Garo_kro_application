# Generated by Django 2.0.2 on 2018-07-16 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kro', '0036_auto_20180705_1434'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='picture_file',
            field=models.ImageField(blank=True, height_field='picture_height', max_length=45, null=True, upload_to='uploads/profile-picture/%Y/%m/%d/', width_field='picture_width'),
        ),
        migrations.AddField(
            model_name='person',
            name='picture_height',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='picture_width',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
