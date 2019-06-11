"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView
from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views
from backend.kro import views as kro_views
from . import views


ROUTER = routers.DefaultRouter()
ROUTER.register(r'attendee-types', kro_views.AttendeeTypeViewSet)
ROUTER.register(r'departments', kro_views.DepartmentViewSet)
ROUTER.register(r'meeting-types', kro_views.MeetingTypeViewSet)
ROUTER.register(r'countries', kro_views.CountryViewSet)
ROUTER.register(r'provinces-states', kro_views.ProvinceStateViewSet)
ROUTER.register(r'company-categories', kro_views.CompanyCategoryViewSet)
ROUTER.register(r'companies', kro_views.CompanyViewSet)
ROUTER.register(r'meeting-sections', kro_views.MeetingSectionViewSet)
ROUTER.register(r'meeting-topics', kro_views.MeetingTopicViewSet)
ROUTER.register(r'meetings', kro_views.MeetingViewSet)
ROUTER.register(r'company-departments', kro_views.CompanyDepartmentViewSet)
ROUTER.register(r'job-categories', kro_views.JobCategoryViewSet)
ROUTER.register(r'job-descriptions', kro_views.JobDescriptionViewSet)
ROUTER.register(r'people', kro_views.PersonViewSet)
ROUTER.register(r'meeting-attendance', kro_views.MeetingAttendanceViewSet)
ROUTER.register(r'meeting-progress-notes',
                kro_views.MeetingProgressNotesViewSet)
ROUTER.register(r'meeting-parking-lots', kro_views.MeetingParkingLotViewSet)
ROUTER.register(r'growth-classes', kro_views.GrowthClassViewSet)
ROUTER.register(r'teams', kro_views.TeamViewSet)
ROUTER.register(r'team-members', kro_views.TeamMemberViewSet)
ROUTER.register(r'successes', kro_views.SuccessViewSet)
ROUTER.register(r'challenges', kro_views.ChallengeViewSet)
ROUTER.register(r'statuses', kro_views.StatusViewSet)
ROUTER.register(r'projects', kro_views.ProjectViewSet)
ROUTER.register(r'milestones', kro_views.MilestoneViewSet)
ROUTER.register(r'project-milestone-development-step-statuses',
                kro_views.ProjectMilestoneDevelopmentStepStatusViewSet)
ROUTER.register(r'values', kro_views.ValueViewSet)
ROUTER.register(r'strength-assessment-requests',
                kro_views.StrengthAssessmentRequestViewSet)
ROUTER.register(r'assessment-request-people',
                kro_views.AssessmentRequestPersonViewSet)
ROUTER.register(r'strength-assessments', kro_views.StrengthAssessmentViewSet)
ROUTER.register(r'strength-assessment-values',
                kro_views.StrengthAssessmentValueViewSet)
ROUTER.register(r'strength-assessment-reviews',
                kro_views.StrengthAssessmentReviewViewSet)
ROUTER.register(r'performance-reviews',
                kro_views.PerformanceReviewViewSet)
ROUTER.register(r'employee-development-plan-reviews',
                kro_views.EmployeeDevelopmentPlanReviewViewSet)
ROUTER.register(r'employee-development-plan-action-steps',
                kro_views.EmployeeDevelopmentPlanActionStepViewSet)


#
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = []
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += [
    path('django-admin/', admin.site.urls),
    path('api/v1/me/', kro_views.get_me),
    path('api/v1/manager-login/', kro_views.manager_login),
    path('api/v1/', include(ROUTER.urls)),
    path('api/v1/api-token-auth/', authtoken_views.obtain_auth_token),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
    # Admin
    # Redirect if no trailing slash, for convenience
    path('admin', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', include('backend.kroadmin.urls')),
    
    path('accounts/',include('django.contrib.auth.urls')),
    # must be catch-all for pushState to work
    path('', views.FrontendAppView.as_view()),
    url(r'^.*$', views.FrontendAppView.as_view()),
]
