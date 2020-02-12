# Generated by Django 2.0.2 on 2018-07-05 18:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kro', '0035_auto_20180704_1326'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeDevelopmentPlanActionStep',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_step_description', models.TextField()),
                ('measure_of_success', models.TextField()),
                ('growth_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kro.GrowthClass')),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kro.Person')),
            ],
        ),
        migrations.CreateModel(
            name='EmployeeDevelopmentPlanReview',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_date', models.DateTimeField(auto_now_add=True)),
                ('review_period_from', models.DateTimeField()),
                ('review_period_to', models.DateTimeField()),
                ('job_specific_dev_needs', models.TextField(blank=True, null=True)),
                ('future_opportunities', models.TextField(blank=True, null=True)),
                ('person_reviewed', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='kro.Person')),
                ('reviewed_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='kro.Person')),
            ],
        ),
        migrations.AddField(
            model_name='employeedevelopmentplanactionstep',
            name='source_employee_dev_review',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.EmployeeDevelopmentPlanReview'),
        ),
        migrations.AddField(
            model_name='employeedevelopmentplanactionstep',
            name='source_performance_review',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.PerformanceReview'),
        ),
        migrations.AddField(
            model_name='employeedevelopmentplanactionstep',
            name='source_strength_assessment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.StrengthAssessmentReview'),
        ),
        migrations.AddField(
            model_name='employeedevelopmentplanactionstep',
            name='team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.Team'),
        ),
        migrations.AddField(
            model_name='projectmilestonedevelopmentstepstatus',
            name='development_plan_step',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='kro.EmployeeDevelopmentPlanActionStep'),
        ),
    ]