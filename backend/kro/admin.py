"""
Registers models with the Django Admin
"""
from django.contrib import admin
from django.utils.timezone import activate
from . import models


class CompanyAdmin(admin.ModelAdmin):
    """
    Override the default admin behaviour for this model
    """
    exclude = ('logo_width', 'logo_height')


class MeetingAdmin(admin.ModelAdmin):
    """
    Override the default admin behaviour for this model
    """

    def add_view(self, request, form_url='', extra_context=None):
        activate("America/Toronto")
        return super().add_view(request, form_url, extra_context=extra_context)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        activate("America/Toronto")
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )


admin.site.register(models.Person)
admin.site.register(models.AttendeeType)
admin.site.register(models.Department)
admin.site.register(models.MeetingType)
admin.site.register(models.Country)
admin.site.register(models.ProvinceState)
admin.site.register(models.CompanyCategory)
admin.site.register(models.Company, CompanyAdmin)
admin.site.register(models.MeetingSection)
admin.site.register(models.MeetingTopic)
admin.site.register(models.Meeting, MeetingAdmin)
admin.site.register(models.CompanyDepartment)
admin.site.register(models.JobCategory)
admin.site.register(models.JobDescription)
admin.site.register(models.MeetingAttendance)
admin.site.register(models.MeetingProgressNotes)
admin.site.register(models.MeetingParkingLot)
admin.site.register(models.GrowthClass)
admin.site.register(models.Team)
admin.site.register(models.TeamMember)
admin.site.register(models.Success)
admin.site.register(models.Challenge)
admin.site.register(models.Status)
admin.site.register(models.Project)
admin.site.register(models.Milestone)
admin.site.register(models.ProjectMilestoneDevelopmentStepStatus)
admin.site.register(models.Value)
admin.site.register(models.StrengthAssessmentRequest)
admin.site.register(models.AssessmentRequestPerson)
admin.site.register(models.StrengthAssessment)
admin.site.register(models.StrengthAssessmentValue)
admin.site.register(models.StrengthAssessmentReview)
admin.site.register(models.PerformanceReview)
admin.site.register(models.EmployeeDevelopmentPlanActionStep)
admin.site.register(models.EmployeeDevelopmentPlanReview)
