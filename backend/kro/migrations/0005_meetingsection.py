# Generated by Django 2.0.2 on 2018-03-14 17:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kro', '0004_profile'),
    ]

    operations = [
        migrations.CreateModel(
            name='MeetingSection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_title', models.CharField(choices=[('BANKING_REVIEW', 'Banking Review (Bookkeeping)'), ('ACCOUNTING_REVIEW', 'Accounting Review (Bookkeeping)'), ('PAYROLL_REVIEW', 'Payroll Review (Bookkeeping)'), ('PARKING_LOT', 'Parking Lot (Manager)')], default='BANKING_REVIEW', max_length=255)),
                ('estimated_duration', models.IntegerField()),
                ('order', models.IntegerField()),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kro.Company')),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.Department')),
                ('meeting_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kro.MeetingType')),
            ],
        ),
    ]
