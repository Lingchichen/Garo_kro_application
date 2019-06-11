"""
This is where the way models are serialized to and from JSON is defined.
"""
from django.contrib.auth.models import User
from rest_framework import serializers
from . import models


class CompanyDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyDepartment
        fields = ('id', 'company', 'name', 'department')


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobCategory
        fields = ('id', 'name', 'order')


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobDescription
        fields = ('id', 'job_title', 'company_department', 'job_category',
                  'summary_of_position', 'report_to', 'administration', 'nature_and_scope')


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User Model
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'is_staff', 'is_active', 'date_joined', 'is_superuser',
                  'groups', 'user_permissions')


class PersonSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile Model
    """
    user = UserSerializer()

    class Meta:
        model = models.Person
        fields = ('id', 'user', 'phone', 'company', 'is_owner', 'is_manager', 'is_employee',
                  'is_third_party', 'job_description', 'join_date', 'position_date', 'employee_number','picture_file','picture_width','picture_height')


class AttendeeTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for AttendeeType Model
    """
    display_name = serializers.CharField(
        read_only=True, source='get_attendee_title_display')

    class Meta:
        model = models.AttendeeType
        fields = ('id', 'attendee_title', 'is_department', 'display_name')


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Department Model
    """
    display_name = serializers.CharField(
        read_only=True, source='get_name_display')

    class Meta:
        model = models.Department
        fields = ('id', 'name', 'order', 'display_name')


class MeetingTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for MeetingType Model
    """
    class Meta:
        model = models.MeetingType
        fields = ('id', 'meeting_title', 'attendee_type',
                  'department', 'description')


class CountrySerializer(serializers.ModelSerializer):
    """
    Serializer for Country Model
    """
    class Meta:
        model = models.Country
        fields = ('id', 'name')


class ProvinceStateSerializer(serializers.ModelSerializer):
    """
    Serializer for ProvinceState Model
    """
    class Meta:
        model = models.ProvinceState
        fields = ('id', 'name', 'country')


class CompanyCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for CompanyCategory Model
    """
    class Meta:
        model = models.CompanyCategory
        fields = ('id', 'name', 'order')


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer for Company Model
    """
    class Meta:
        model = models.Company
        fields = ('id', 'name', 'address', 'city', 'postal_code', 'province',
                  'country', 'client_date', 'category', 'logo_file', 'year_end')


class MeetingSectionSerializer(serializers.ModelSerializer):
    """
    Serializer for MeetingSection Model
    """
    display_name = serializers.CharField(
        read_only=True, source='get_title_display')

    class Meta:
        model = models.MeetingSection
        fields = ('id', 'meeting_type', 'company', 'title', 'display_name',
                  'department', 'estimated_duration', 'order')


class MeetingTopicSerializer(serializers.ModelSerializer):
    """
    Serializer for MeetingTopic Model
    """
    display_name = serializers.CharField(
        read_only=True, source='get_title_display')

    class Meta:
        model = models.MeetingTopic
        fields = ('id', 'section', 'title', 'display_name', 'review_financials',
                  'review_success_challenge', 'review_project', 'order')


class MeetingSerializer(serializers.ModelSerializer):
    """
    Serializer for Meeting Model
    """
    class Meta:
        model = models.Meeting
        fields = ('id', 'meeting_type', 'company', 'date_time', 'location',
                  'start_date_time', 'end_date_time')


class MeetingAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MeetingAttendance
        fields = ('id', 'meeting', 'person', 'role')


class MeetingProgressNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MeetingProgressNotes
        fields = ('id', 'meeting', 'topic', 'presenter',
                  'meeting_notes', 'post_meeting_notes', 'section')

    def create(self, validated_data):
        notes, created = models.MeetingProgressNotes.objects.update_or_create(
            meeting=validated_data.get('meeting', None),
            topic=validated_data.get('topic', None),
            defaults={
                'meeting': validated_data.get('meeting', None),
                'topic': validated_data.get('topic', None),
                'presenter': validated_data.get('presenter', None),
                'meeting_notes': validated_data.get('meeting_notes', None),
                'post_meeting_notes': validated_data.get('post_meeting_notes', None),
                'section': validated_data.get('section', None),
            }
        )
        return notes


class MeetingParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MeetingParkingLot
        fields = ('id', 'meeting', 'meeting_section', 'meeting_topic',
                  'originator', 'notes', 'time_alloted')


class GrowthClassSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(
        read_only=True, source='get_title_display')

    class Meta:
        model = models.GrowthClass
        fields = ('id', 'title', 'order', 'display_name')


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Team
        fields = ('id', 'date_created', 'active')


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMember
        fields = ('id', 'team', 'member_type', 'person', 'company_department',
                  'external_vendor', 'role', 'date_joined', 'active')


class SuccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Success
        fields = ('id', 'title', 'company', 'description', 'meeting', 'date_time', 'growth_class',
                  'benefit_summary', 'team', 'financial_success', 'team_success', 'brand_success', 'individual_success')


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Challenge
        fields = ('id', 'title', 'company', 'problem', 'meeting', 'date_time', 'originator', 'group_input',
                  'team', 'growth_class', 'financial_benefit', 'team_benefit', 'brand_benefit', 'individual_benefit')


class StatusSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(
        read_only=True, source='get_title_display')

    class Meta:
        model = models.Status
        fields = ('id', 'title', 'order', 'display_name')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = ('id', 'title', 'meeting', 'company', 'team', 'growth_class', 'problem', 'opportunity_or_gains',
                  'estimated_budget', 'goals', 'budget_approved', 'budget_department', 'stall_alert')


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Milestone
        fields = ('id', 'title', 'project', 'meeting', 'company', 'problem', 'growth_class', 'team',
                  'opportunity_or_gains', 'estimated_budget', 'budget_approved', 'budget_department', 'stall_alert')


class ProjectMilestoneDevelopmentStepStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProjectMilestoneDevelopmentStepStatus
        fields = ('id', 'project', 'milestone', 'development_plan_step', 'meeting', 'status', 'date',
                  'percent_complete', 'comments', 'new_budget', 'new_due_date', )


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Value
        fields = ('id', 'company', 'value_type', 'title', 'statement', 'order')


class StrengthAssessmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StrengthAssessmentRequest
        fields = ('id', 'person_assessed', 'request_date',
                  'review_period_from', 'review_period_to', 'randomize_values')


class AssessmentRequestPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AssessmentRequestPerson
        fields = ('id', 'strength_assessment_request',
                  'assessed_by_person', 'completed')


class StrengthAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StrengthAssessment
        fields = ('id', 'assessment_request', 'assessed_by_person', 'assessment_date', 'assessment_start_time', 'assessment_end_time',
                  'development_skill', 'development_knowledge', 'development_passion', 'development_wisdom', 'employee_additional_comments')


class StrengthAssessmentValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StrengthAssessmentValue
        fields = ('id', 'strength_assessment', 'value', 'value_score', 'order')


class StrengthAssessmentReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StrengthAssessmentReview
        fields = ('id', 'assessment_request', 'assessed_by_person',
                  'review_date', 'reviewers_comments', 'employee_comments', 'completed')

    def validate(self, data):
        if data.get('completed'):
            blank_error = "This field must be filled out to complete the review"
            fields = ('reviewers_comments', 'employee_comments')
            field_errors = {f: blank_error for f in fields if not data[f]}
            if len(field_errors):
                raise serializers.ValidationError(field_errors)
        return data


class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PerformanceReview
        fields = ('id','person_reviewed','reviewed_by_person','date_of_appraisal','review_period_from','review_period_to','overall_performance',
                    'strengths','areas_for_further_development','challenges','employee_comments','completed')

    def validate(self, data):
        if data.get('completed'):
            overall_performance_error = "Overall performance must be filled out to complete the review"
            strength_error="Strength must be filled out to complete the review"
            area_for_futher_development_error="Area for further development must be filled out to complete the review"
            chanllenge_error="Chanllenge must be filled out to complete the review"
            employee_comments_error="Employee comments must be filled out to complete the review"
            blank_error="This field must be filled out to complete the review"
            fields=('overall_performance','strengths','areas_for_further_development','challenges','employee_comments')
            field_errors = {f: blank_error for f in fields if not data[f]}
            if len(field_errors):
                raise serializers.ValidationError(field_errors)
                '''
            overall_performance_fields = ('overall_performance',)
            strength_fields=('strengths',)
            area_for_futher_development_fields=('areas_for_further_development',)
            challenge_fields=('challenges',)
            employee_comment_fields=('employee_comments',)
            overall_performance_field_errors = {f: overall_performance_error for  f in overall_performance_fields if not data[f]}
            if len(overall_performance_field_errors):
                raise serializers.ValidationError(overall_performance_field_errors)
            strength_field_errors = {f: strength_error for  f in strength_fields if not data[f]}
            if len(strength_field_errors):
                raise serializers.ValidationError(strength_field_errors)
            area_for_futher_development_field_errors = {f: area_for_futher_development_error for  f in area_for_futher_development_fields if not data[f]}
            if len(area_for_futher_development_field_errors):
                raise serializers.ValidationError(area_for_futher_development_field_errors)
            chanllenge_field_errors = {f: chanllenge_error for  f in challenge_fields if not data[f]}
            if len(chanllenge_field_errors):
                raise serializers.ValidationError(chanllenge_field_errors)
            employee_comments_field_errors = {f: employee_comments_error for  f in employee_comment_fields if not data[f]}
            if len(employee_comments_field_errors):
                raise serializers.ValidationError(employee_comments_field_errors)
                '''
        return data


class EmployeeDevelopmentPlanReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmployeeDevelopmentPlanReview
        fields = ('id','person_reviewed','reviewed_by','assessment_date','review_period_from','review_period_to','job_specific_dev_needs','future_opportunities', 'completed')

    def validate(self, data):
        if data.get('completed'):
            blank_error = "This field must be filled out to complete the review"
            fields = ('job_specific_dev_needs', 'future_opportunities')
            field_errors = {f: blank_error for f in fields if not data[f]}
            if len(field_errors):
                raise serializers.ValidationError(field_errors)
        return data


class EmployeeDevelopmentPlanActionStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmployeeDevelopmentPlanActionStep
        fields = ('id','person','action_step_description','growth_class','measure_of_success','source_employee_dev_review','source_strength_assessment','source_performance_review','team')
