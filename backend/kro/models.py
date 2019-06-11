"""
Internal Models for the application.
"""

#pylint: disable=unused-argument

from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver


class AttendeeType(models.Model):
    """
    A model for the different types of attendees that can attend meetings.
    """
    OWNERS = 'OWNERS'
    MANAGERS = 'MANAGERS'
    EMPLOYEES = 'EMPLOYEES'
    DEPARTMENT = 'DEPARTMENT'
    THIRD_PARTY = 'THIRD_PARTY'

    TITLE_CHOICES = (
        (OWNERS, 'Owners'),
        (MANAGERS, 'Managers'),
        (EMPLOYEES, 'Employees'),
        (DEPARTMENT, 'Department'),
        (THIRD_PARTY, 'Third Party'),
    )

    attendee_title = models.CharField(
        max_length=255, choices=TITLE_CHOICES, default=OWNERS)

    is_department = models.BooleanField(default=False)

    def __str__(self):
        return self.get_attendee_title_display()


class Department(models.Model):
    """
    A model for the different types of Departments that a company might have.
    """
    MARKETING = 'MARKETING'
    PRODUCT_DEVELOPMENT = 'PRODUCT_DEVELOPMENT'
    MANUFACTURING = 'MANUFACTURING'
    QUALITY_ASSURANCE = 'QUALITY_ASSURANCE'
    SHIPPING = 'SHIPPING'

    NAME_CHOICES = (
        (MARKETING, 'Marketing'),
        (PRODUCT_DEVELOPMENT, 'Product Development'),
        (MANUFACTURING, 'Manufacturing'),
        (QUALITY_ASSURANCE, 'Quality Assurance'),
        (SHIPPING, 'Shipping'),
    )

    name = models.CharField(
        max_length=255, choices=NAME_CHOICES, default=MARKETING)

    order = models.IntegerField()

    def __str__(self):
        return self.get_name_display()


class MeetingType(models.Model):
    """
    A model for the different types of Meetings that can be held.
    """
    meeting_title = models.CharField(max_length=255)
    attendee_type = models.ForeignKey(AttendeeType, on_delete=models.CASCADE)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField()

    def clean(self):
        # custom validation
        super(MeetingType, self).clean()
        if self.attendee_type.is_department and self.department is None:
            raise ValidationError("""Because the specified attendee type is a
                department type, a department must be specified.""")

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.full_clean()
        super(MeetingType, self).save()

    def __str__(self):
        return self.meeting_title


class Country(models.Model):
    """
    A model for countries
    """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ProvinceState(models.Model):
    """
    A model for provinces / states
    """
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class CompanyCategory(models.Model):
    """
    A model for a category of company.  As in, different industries and sectors.
    """
    INFORMATION_TECHNOLOGY = 'INFORMATION_TECHNOLOGY'
    MANUFACTURING = 'MANUFACTURING'
    SERVICE = 'SERVICE'
    RETAIL = 'RETAIL'

    NAME_CHOICES = (
        (INFORMATION_TECHNOLOGY, 'Information Technology'),
        (MANUFACTURING, 'Manufacturing'),
        (SERVICE, 'Service'),
        (RETAIL, 'Retail'),
    )

    name = models.CharField(
        max_length=255, choices=NAME_CHOICES, default=INFORMATION_TECHNOLOGY)
    order = models.IntegerField()

    def __str__(self):
        return self.get_name_display()


class Company(models.Model):
    """
    A model for a Company.
    """
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    province = models.ForeignKey(ProvinceState, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    client_date = models.DateField()
    category = models.ForeignKey(CompanyCategory, on_delete=models.CASCADE)
    logo_width = models.PositiveIntegerField()
    logo_height = models.PositiveIntegerField()
    logo_file = models.ImageField(
        upload_to='uploads/company-logos/%Y/%m/%d/',
        max_length=255,
        width_field='logo_width',
        height_field='logo_height'
    )
    year_end = models.DateField()

    def __str__(self):
        return self.name


class CompanyDepartment(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return ' - '.join([
            str(self.company),
            self.name
        ])


class JobCategory(models.Model):
    ADMINISTRATION = 'ADMINISTRATION'
    SALES = 'SALES'
    PRODUCTION = 'PRODUCTION'
    SERVICE = 'SERVICE'

    NAME_CHOICES = (
        (ADMINISTRATION, 'Administration'),
        (SALES, 'Sales'),
        (PRODUCTION, 'Production'),
        (SERVICE, 'Service'),
    )

    name = models.CharField(
        max_length=255, choices=NAME_CHOICES, default=ADMINISTRATION)
    order = models.IntegerField()

    def __str__(self):
        return self.get_name_display()


class JobDescription(models.Model):
    job_title = models.CharField(max_length=255)
    company_department = models.ForeignKey(
        CompanyDepartment, on_delete=models.CASCADE)
    job_category = models.ForeignKey(JobCategory, on_delete=models.CASCADE)
    summary_of_position = models.TextField()
    report_to = models.CharField(max_length=255)
    administration = models.CharField(max_length=255)
    nature_and_scope = models.CharField(max_length=255)

    def __str__(self):
        return str(self.company_department) + " - " + str(self.job_title)


class Person(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    is_owner = models.BooleanField()
    is_manager = models.BooleanField()
    is_employee = models.BooleanField()
    is_third_party = models.BooleanField()
    job_description = models.ForeignKey(
        JobDescription, on_delete=models.CASCADE)
    join_date = models.DateField()
    position_date = models.DateField()
    employee_number = models.CharField(max_length=255)
    picture_width = models.PositiveIntegerField(null=True,blank=True)
    picture_height = models.PositiveIntegerField(null=True,blank=True)
    picture_file = models.ImageField(
        upload_to='uploads/profile-picture/%Y/%m/%d/',
        max_length=255,
        width_field='picture_width',
        height_field='picture_height',
        null=True,
        blank=True,
    )

    def __str__(self):
        return str(self.user.first_name) + " " + str(self.user.last_name)


class MeetingSection(models.Model):
    """
    A model for a section of a specific type of meeting with a specific company.
    """
    BANKING_REVIEW = 'BANKING_REVIEW'
    ACCOUNTING_REVIEW = 'ACCOUNTING_REVIEW'
    PAYROLL_REVIEW = 'PAYROLL_REVIEW'
    PARKING_LOT = 'PARKING_LOT'

    TITLE_CHOICES = (
        (BANKING_REVIEW, 'Banking Review (Bookkeeping)'),
        (ACCOUNTING_REVIEW, 'Accounting Review (Bookkeeping)'),
        (PAYROLL_REVIEW, 'Payroll Review (Bookkeeping)'),
        (PARKING_LOT, 'Parking Lot (Manager)'),
    )

    meeting_type = models.ForeignKey(MeetingType, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(
        max_length=255, choices=TITLE_CHOICES, default=BANKING_REVIEW)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, blank=True, null=True)
    estimated_duration = models.IntegerField()
    order = models.IntegerField()

    def __str__(self):
        return ' - '.join([
            str(self.company),
            str(self.meeting_type),
            str(self.get_title_display())
        ])


class MeetingTopic(models.Model):
    """
    A model for a sub-topic of a specific meeting section.
    """
    BOOKKEEPING_PROGRESS_REPORT = 'BOOKKEEPING_PROGRESS_REPORT'
    BUDGET_VS_ACTUAL_REPORT = 'BUDGET_VS_ACTUAL_REPORT'
    BOOKKEEPTING_SUCCESS_CHALLENGES_OPPORTUNITIES = 'BOOKKEEPTING_SUCCESS_CHALLENGES_OPPORTUNITIES'

    TITLE_CHOICES = (
        (BOOKKEEPING_PROGRESS_REPORT, 'Bookkeeping progress report - AP / AR'),
        (BUDGET_VS_ACTUAL_REPORT, 'Budget vs Actual report'),
        (BOOKKEEPTING_SUCCESS_CHALLENGES_OPPORTUNITIES,
         'Bookkeeping - Success / Challenges / Opportunities'),
    )

    section = models.ForeignKey(MeetingSection, on_delete=models.CASCADE)
    title = models.CharField(
        max_length=255, choices=TITLE_CHOICES, default=BOOKKEEPING_PROGRESS_REPORT)
    review_financials = models.BooleanField()
    review_success_challenge = models.BooleanField()
    review_project = models.BooleanField()
    order = models.IntegerField()

    def __str__(self):
        return ' - '.join([
            str(self.section.company),
            str(self.section.meeting_type),
            self.section.get_title_display(),
            self.get_title_display()
        ])


class Meeting(models.Model):
    """
    A model for a Meeting.
    """
    meeting_type = models.ForeignKey(MeetingType, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    location = models.CharField(max_length=255)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()

    def __str__(self):
        return str(self.date_time) + " - " + str(self.meeting_type) + ' - ' + str(self.company)


class MeetingAttendance(models.Model):
    """
    Attendance records for meetings.
    """
    ATTENDEE = 'ATTENDEE'
    FACILITATOR = 'FACILITATOR'
    CHAIR = 'CHAIR'

    ROLE_CHOICES = (
        (ATTENDEE, 'Attendee'),
        (FACILITATOR, 'Facilitator'),
        (CHAIR, 'Chair'),
    )

    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=255, choices=ROLE_CHOICES, default=ATTENDEE)

    def __str__(self):
        return str(self.meeting) + " - " + str(self.person)


class MeetingProgressNotes(models.Model):
    """
    Meeting Notes and Post Meeting Notes
    """
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    topic = models.ForeignKey(
        MeetingTopic, on_delete=models.CASCADE, blank=True, null=True)
    section = models.ForeignKey(
        MeetingSection, on_delete=models.CASCADE, blank=True, null=True)
    presenter = models.ForeignKey(Person, on_delete=models.CASCADE)
    meeting_notes = models.TextField(blank=True)
    post_meeting_notes = models.TextField(blank=True)

    def clean(self):
        # custom validation
        super(MeetingProgressNotes, self).clean()
        if self.topic is None and self.section is None:
            raise ValidationError(
                """There must be a specified section for the "Other" Topic""")

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.full_clean()
        super(MeetingProgressNotes, self).save()

    def __str__(self):
        return str(self.meeting) + " - " + str(self.topic)


class MeetingParkingLot(models.Model):
    """
    Parking Lot entries for Meetings
    """
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    meeting_section = models.ForeignKey(
        MeetingSection, on_delete=models.CASCADE, blank=True, null=True)
    meeting_topic = models.ForeignKey(
        MeetingTopic, on_delete=models.CASCADE, blank=True, null=True)
    originator = models.ForeignKey(Person, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    time_alloted = models.IntegerField()  # Number of minutes assigned

    def __str__(self):
        return str(self.meeting) + " - " + str(self.notes)


class GrowthClass(models.Model):
    """
    Used for Successes, Challenges, Projects, and Milestones.
    """
    COMMUNICATION = 'COMMUNICATION'
    PROCESS = 'PROCESS'
    COMPETENCY = 'COMPETENCY'

    TITLE_CHOICES = (
        (COMMUNICATION, 'Communication'),
        (PROCESS, 'Process'),
        (COMPETENCY, 'Competency'),
    )

    title = models.CharField(
        max_length=255, choices=TITLE_CHOICES, default=COMMUNICATION)
    order = models.IntegerField()

    def __str__(self):
        return self.get_title_display()


class Team(models.Model):
    """
    Represents a team of people who can be assigned to a variety of things.
    """
    date_created = models.DateField(auto_now_add=True)
    active = models.BooleanField()


class TeamMember(models.Model):
    """
    Represents a person's membership in a team.
    """
    PERSON = 'PERSON'
    DEPARTMENT = 'DEPARTMENT'
    EXTERNAL = 'EXTERNAL'

    MEMBER_TYPE_CHOICES = (
        (PERSON, 'Person'),
        (DEPARTMENT, 'Department'),
        (EXTERNAL, 'External'),
    )

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    member_type = models.CharField(
        max_length=255, choices=MEMBER_TYPE_CHOICES, default=PERSON)
    person = models.ForeignKey(
        Person, on_delete=models.CASCADE, null=True, blank=True)
    company_department = models.ForeignKey(
        CompanyDepartment, on_delete=models.CASCADE, null=True, blank=True)
    external_vendor = models.CharField(
        max_length=255, blank=True, null=True)
    role = models.CharField(max_length=255, blank=True, null=True)
    date_joined = models.DateField(auto_now_add=True)
    active = models.BooleanField(default=True)


class Success(models.Model):
    """
    Represents something that is worthy of recognition.
    """
    title = models.CharField(max_length=255)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField()
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, blank=True, null=True)
    date_time = models.DateTimeField(auto_now_add=True)
    growth_class = models.ForeignKey(GrowthClass, on_delete=models.CASCADE)
    benefit_summary = models.TextField()
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, null=True)
    financial_success = models.BooleanField()
    team_success = models.BooleanField()
    brand_success = models.BooleanField()
    individual_success = models.BooleanField()

    def __str__(self):
        return str(self.meeting) + " - " + str(self.title)


class Challenge(models.Model):
    """
    Represents a significant roadblock to meeting some goal / milestone
    """
    title = models.CharField(max_length=255)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, blank=True, null=True)
    problem = models.TextField()
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, blank=True, null=True)
    date_time = models.DateTimeField(auto_now_add=True)
    originator = models.ForeignKey(Person, on_delete=models.CASCADE)
    group_input = models.TextField()
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, null=True)
    growth_class = models.ForeignKey(GrowthClass, on_delete=models.CASCADE)
    financial_benefit = models.BooleanField()
    team_benefit = models.BooleanField()
    brand_benefit = models.BooleanField()
    individual_benefit = models.BooleanField()

    def __str__(self):
        return str(self.meeting) + " - " + str(self.title)


class Status(models.Model):
    NEW = 'NEW'
    ACTIVE = 'ACTIVE'
    ON_HOLD = 'ON_HOLD'
    CLOSED = 'CLOSED'

    TITLE_CHOICES = (
        (NEW, 'New'),
        (ACTIVE, 'Active'),
        (ON_HOLD, 'On Hold'),
        (CLOSED, 'Closed'),
    )

    title = models.CharField(
        max_length=255, choices=TITLE_CHOICES, default=NEW)
    order = models.IntegerField()

    def __str__(self):
        return self.get_title_display()


class Project(models.Model):
    title = models.CharField(max_length=255)
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, blank=True, null=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, blank=True, null=True)
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, null=True)
    growth_class = models.ForeignKey(GrowthClass, on_delete=models.CASCADE)
    problem = models.TextField()
    opportunity_or_gains = models.TextField()
    estimated_budget = models.CharField(max_length=255)
    goals = models.CharField(max_length=255, blank=True)
    budget_approved = models.BooleanField()
    budget_department = models.ForeignKey(Department, on_delete=models.CASCADE)
    stall_alert = models.BooleanField()

    def __str__(self):
        return str(self.title)


class Milestone(models.Model):
    title = models.CharField(max_length=255)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, blank=True, null=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, blank=True, null=True)
    problem = models.TextField()
    growth_class = models.ForeignKey(GrowthClass, on_delete=models.CASCADE)
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, blank=True, null=True)
    opportunity_or_gains = models.TextField()
    estimated_budget = models.CharField(max_length=255)
    budget_approved = models.BooleanField()
    budget_department = models.ForeignKey(Department, on_delete=models.CASCADE)
    stall_alert = models.BooleanField()

    def __str__(self):
        return str(self.title)


class Value(models.Model):
    FINANCIAL = 'FINANCIAL'
    TEAM = 'TEAM'
    BRAND = 'BRAND'

    TYPE_CHOICES = (
        (FINANCIAL, 'Financial'),
        (TEAM, 'Team'),
        (BRAND, 'Brand')
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    value_type = models.CharField(
        max_length=255, choices=TYPE_CHOICES, default=FINANCIAL)
    title = models.CharField(max_length=255)
    statement = models.CharField(max_length=255)
    order = models.IntegerField()


class StrengthAssessmentRequest(models.Model):
    person_assessed = models.ForeignKey(Person, on_delete=models.CASCADE)
    request_date = models.DateTimeField(auto_now_add=True)
    review_period_from = models.DateTimeField()
    review_period_to = models.DateTimeField()
    randomize_values = models.BooleanField()


class AssessmentRequestPerson(models.Model):
    strength_assessment_request = models.ForeignKey(
        StrengthAssessmentRequest, on_delete=models.CASCADE)
    assessed_by_person = models.ForeignKey(Person, on_delete=models.CASCADE)
    completed = models.BooleanField()


class StrengthAssessment(models.Model):
    assessment_request = models.ForeignKey(
        StrengthAssessmentRequest, on_delete=models.CASCADE)
    assessed_by_person = models.ForeignKey(Person, on_delete=models.CASCADE)
    assessment_date = models.DateTimeField(auto_now_add=True)
    assessment_start_time = models.DateTimeField()
    assessment_end_time = models.DateTimeField()
    development_skill = models.IntegerField()
    development_knowledge = models.IntegerField()
    development_passion = models.IntegerField()
    development_wisdom = models.IntegerField()
    employee_additional_comments = models.TextField()


class StrengthAssessmentValue(models.Model):
    strength_assessment = models.ForeignKey(
        StrengthAssessment, on_delete=models.CASCADE)
    value = models.ForeignKey(Value, on_delete=models.CASCADE)
    value_score = models.IntegerField()
    order = models.IntegerField()


class StrengthAssessmentReview(models.Model):
    assessment_request = models.ForeignKey(
        StrengthAssessmentRequest, on_delete=models.CASCADE)
    assessed_by_person = models.ForeignKey(Person, on_delete=models.CASCADE)
    review_date = models.DateTimeField(auto_now_add=True)
    reviewers_comments = models.TextField(blank=True, null=True)
    employee_comments = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    def clean(self):
        super(StrengthAssessmentReview, self).clean()
        if self.completed and (not self.reviewers_comments or not self.employee_comments):
            raise ValidationError("Reviewer and employee comments must be filled out to complete the review.")

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.full_clean()
        super(StrengthAssessmentReview, self).save()


class PerformanceReview(models.Model):
    person_reviewed = models.ForeignKey(Person,on_delete=models.CASCADE,related_name="+")
    reviewed_by_person=models.ForeignKey(Person,on_delete=models.CASCADE,related_name="+")
    date_of_appraisal= models.DateTimeField(auto_now_add=True)
    review_period_from= models.DateTimeField()
    review_period_to =  models.DateTimeField()
    overall_performance=models.TextField(blank=True, null=True)
    strengths=models.TextField(blank=True, null=True)
    areas_for_further_development=models.TextField(blank=True, null=True)
    challenges=models.TextField(blank=True, null=True)
    employee_comments=models.TextField(blank=True, null=True)
    completed= models.BooleanField(default=False)

    def clean(self):
        super(PerformanceReview, self).clean()
        if self.completed and (not self.overall_performance or not self.strengths or not areas_for_further_development or not challenges or not employee_comments):
            raise ValidationError("Overall Performance ,strengths,Areas for further development,Challenges and Employee comments must be filled out to complete the review.")

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.full_clean()
        super(PerformanceReview, self).save()




class EmployeeDevelopmentPlanReview(models.Model):
    person_reviewed = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="+")
    reviewed_by = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="+")
    assessment_date = models.DateTimeField(auto_now_add=True)
    review_period_from = models.DateTimeField()
    review_period_to = models.DateTimeField()
    job_specific_dev_needs = models.TextField(blank=True, null=True)
    future_opportunities = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    def clean(self):
        super(EmployeeDevelopmentPlanReview, self).clean()
        if self.completed and (not self.job_specific_dev_needs or not self.future_opportunities):
            raise ValidationError("Job specific development needs and future opportunities must be filled out to complete the review.")

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.full_clean()
        super(EmployeeDevelopmentPlanReview, self).save()


class EmployeeDevelopmentPlanActionStep(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    action_step_description = models.TextField()
    growth_class = models.ForeignKey(GrowthClass, on_delete=models.CASCADE)
    measure_of_success = models.TextField()
    source_employee_dev_review = models.ForeignKey(EmployeeDevelopmentPlanReview, on_delete=models.CASCADE, blank=True, null=True)
    source_strength_assessment = models.ForeignKey(StrengthAssessmentReview, on_delete=models.CASCADE, blank=True, null=True)
    source_performance_review = models.ForeignKey(PerformanceReview, on_delete=models.CASCADE, blank=True, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, blank=True, null=True)


class ProjectMilestoneDevelopmentStepStatus(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, blank=True, null=True)
    milestone = models.ForeignKey(
        Milestone, on_delete=models.CASCADE, blank=True, null=True)
    development_plan_step = models.ForeignKey(EmployeeDevelopmentPlanActionStep, on_delete=models.CASCADE, blank=True, null=True)
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, blank=True, null=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    percent_complete = models.IntegerField()
    comments = models.TextField()
    new_budget = models.CharField(max_length=255)
    new_due_date = models.DateField()
