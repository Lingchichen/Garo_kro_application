# Generated by Django 2.0.2 on 2018-06-13 18:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kro', '0031_remove_strengthassessment_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='strengthassessmentrequest',
            name='randomize_values',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]