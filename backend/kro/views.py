"""
Views for the App
"""

# pylint: disable=too-many-ancestors

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from django.contrib.auth import authenticate
from . import models
from . import serializers


def checkManagerToken(request):
    company_id = request.user.person.company.id
    provided_manager_token = request.data.get("manager_token", "")
    try:
        manager_token = Token.objects.get(key=provided_manager_token)
    except Token.DoesNotExist:
        raise AuthenticationFailed(detail="Manager credential not provided", code=status.HTTP_401_UNAUTHORIZED)
    manager_user = manager_token.user
    if not manager_user.person:
        raise AuthenticationFailed(detail="That user is configured incorrectly.", code=status.HTTP_401_UNAUTHORIZED)
    manager = manager_user.person
    if manager.id is request.user.person.id:
        raise PermissionDenied(detail="You cannot facilitate your own review.", code=status.HTTP_403_FORBIDDEN)
    if not manager_user.is_superuser and not manager_user.is_staff:
        if manager.company.id is not company_id:
            raise PermissionDenied(detail="That user is not part of the same company.", code=status.HTTP_403_FORBIDDEN)
        if not manager.is_owner and not manager.is_manager:
            raise PermissionDenied(detail="That user is not an owner or manager.", code=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_me(request):
    """
    Getting the model for the current user.
    """
    return Response(serializers.PersonSerializer(request.user.person).data)


@api_view(['POST'])
def manager_login(request):
    """
    Getting a manager login for reviews
    """
    company_id = request.user.person.company.id
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    manager = authenticate(username=username, password=password)
    if not manager:
        raise AuthenticationFailed(detail="That user does not exist.", code=status.HTTP_401_UNAUTHORIZED)
    if not manager.person:
        raise AuthenticationFailed(detail="That user is configured incorrectly.", code=status.HTTP_401_UNAUTHORIZED)
    if manager.person.id is request.user.person.id:
        raise PermissionDenied(detail="You cannot facilitate your own review.", code=status.HTTP_403_FORBIDDEN)
    if not manager.is_superuser and not manager.is_staff:
        if manager.person.company.id is not company_id:
            raise PermissionDenied(detail="That user is not part of the same company.", code=status.HTTP_403_FORBIDDEN)
        if not manager.person.is_owner and not manager.person.is_manager:
            raise PermissionDenied(detail="That user is not an owner or manager.", code=status.HTTP_403_FORBIDDEN)

    manager_token = None
    try:
        manager_token = Token.objects.get(user=manager)
    except Token.DoesNotExist:
        manager_token = Token.objects.create(user=manager)
    return Response({ 'token': manager_token.key })


class CompanyDepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.CompanyDepartment.objects.all()
    serializer_class = serializers.CompanyDepartmentSerializer


class JobCategoryViewSet(viewsets.ModelViewSet):
    queryset = models.JobCategory.objects.all()
    serializer_class = serializers.JobCategorySerializer


class JobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = models.JobDescription.objects.all()
    serializer_class = serializers.JobDescriptionSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer


class AttendeeTypeViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the AttendeeType Model
    """
    queryset = models.AttendeeType.objects.all()
    serializer_class = serializers.AttendeeTypeSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the Department Model
    """
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer


class MeetingTypeViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the MeetingType Model
    """
    queryset = models.MeetingType.objects.all()
    serializer_class = serializers.MeetingTypeSerializer


class CountryViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the Country Model
    """
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer


class ProvinceStateViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the ProvinceState Model
    """
    queryset = models.ProvinceState.objects.all()
    serializer_class = serializers.ProvinceStateSerializer


class CompanyCategoryViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the CompanyCategory Model
    """
    queryset = models.CompanyCategory.objects.all()
    serializer_class = serializers.CompanyCategorySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the Company Model
    """
    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer


class MeetingSectionViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the MeetingSection Model
    """
    queryset = models.MeetingSection.objects.all()
    serializer_class = serializers.MeetingSectionSerializer


class MeetingTopicViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the MeetingTopic Model
    """
    queryset = models.MeetingTopic.objects.all()
    serializer_class = serializers.MeetingTopicSerializer


class MeetingViewSet(viewsets.ModelViewSet):
    """
    An API viewset for the Meeting Model
    """
    queryset = models.Meeting.objects.all()
    serializer_class = serializers.MeetingSerializer


class MeetingAttendanceViewSet(viewsets.ModelViewSet):
    queryset = models.MeetingAttendance.objects.all()
    serializer_class = serializers.MeetingAttendanceSerializer


class MeetingProgressNotesViewSet(viewsets.ModelViewSet):
    queryset = models.MeetingProgressNotes.objects.all()
    serializer_class = serializers.MeetingProgressNotesSerializer


class MeetingParkingLotViewSet(viewsets.ModelViewSet):
    queryset = models.MeetingParkingLot.objects.all()
    serializer_class = serializers.MeetingParkingLotSerializer


class GrowthClassViewSet(viewsets.ModelViewSet):
    queryset = models.GrowthClass.objects.all()
    serializer_class = serializers.GrowthClassSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = models.Team.objects.all()
    serializer_class = serializers.TeamSerializer


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = models.TeamMember.objects.all()
    serializer_class = serializers.TeamMemberSerializer


class SuccessViewSet(viewsets.ModelViewSet):
    queryset = models.Success.objects.all()
    serializer_class = serializers.SuccessSerializer


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = models.Challenge.objects.all()
    serializer_class = serializers.ChallengeSerializer


class StatusViewSet(viewsets.ModelViewSet):
    queryset = models.Status.objects.all()
    serializer_class = serializers.StatusSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = models.Milestone.objects.all()
    serializer_class = serializers.MilestoneSerializer


class ProjectMilestoneDevelopmentStepStatusViewSet(viewsets.ModelViewSet):
    queryset = models.ProjectMilestoneDevelopmentStepStatus.objects.all()
    serializer_class = serializers.ProjectMilestoneDevelopmentStepStatusSerializer


class ValueViewSet(viewsets.ModelViewSet):
    queryset = models.Value.objects.all()
    serializer_class = serializers.ValueSerializer


class StrengthAssessmentRequestViewSet(viewsets.ModelViewSet):
    queryset = models.StrengthAssessmentRequest.objects.all()
    serializer_class = serializers.StrengthAssessmentRequestSerializer


class AssessmentRequestPersonViewSet(viewsets.ModelViewSet):
    queryset = models.AssessmentRequestPerson.objects.all()
    serializer_class = serializers.AssessmentRequestPersonSerializer


class StrengthAssessmentViewSet(viewsets.ModelViewSet):
    queryset = models.StrengthAssessment.objects.all()
    serializer_class = serializers.StrengthAssessmentSerializer


class StrengthAssessmentValueViewSet(viewsets.ModelViewSet):
    queryset = models.StrengthAssessmentValue.objects.all()
    serializer_class = serializers.StrengthAssessmentValueSerializer


class StrengthAssessmentReviewViewSet(viewsets.ModelViewSet):
    queryset = models.StrengthAssessmentReview.objects.all()
    serializer_class = serializers.StrengthAssessmentReviewSerializer

    def create(self, request):
        checkManagerToken(request)
        return super(StrengthAssessmentReviewViewSet, self).create(request)

    def update(self, request, pk=None):
        checkManagerToken(request)
        return super(StrengthAssessmentReviewViewSet, self).update(request, pk=pk)

    def destroy(self, request, pk=None):
        checkManagerToken(request)
        return super(StrengthAssessmentReviewViewSet, self).destroy(request, pk=pk)


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = models.PerformanceReview.objects.all()
    serializer_class = serializers.PerformanceReviewSerializer

    def create(self, request):
        checkManagerToken(request)
        return super(PerformanceReviewViewSet, self).create(request)

    def update(self, request, pk=None):
        checkManagerToken(request)
        return super(PerformanceReviewViewSet, self).update(request, pk=pk)

    def destroy(self, request, pk=None):
        checkManagerToken(request)
        return super(PerformanceReviewViewSet, self).destroy(request, pk=pk)


class EmployeeDevelopmentPlanReviewViewSet(viewsets.ModelViewSet):
    queryset = models.EmployeeDevelopmentPlanReview.objects.all()
    serializer_class = serializers.EmployeeDevelopmentPlanReviewSerializer

    def create(self, request):
        checkManagerToken(request)
        return super(EmployeeDevelopmentPlanReviewViewSet, self).create(request)

    def update(self, request, pk=None):
        checkManagerToken(request)
        return super(EmployeeDevelopmentPlanReviewViewSet, self).update(request, pk=pk)

    def destroy(self, request, pk=None):
        checkManagerToken(request)
        return super(EmployeeDevelopmentPlanReviewViewSet, self).destroy(request, pk=pk)


class EmployeeDevelopmentPlanActionStepViewSet(viewsets.ModelViewSet):
    queryset = models.EmployeeDevelopmentPlanActionStep.objects.all()
    serializer_class = serializers.EmployeeDevelopmentPlanActionStepSerializer
