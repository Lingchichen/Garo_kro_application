from django.urls import path
from django.conf.urls import include
from django.views.generic import RedirectView
from django.contrib.auth.views import login, logout
from .clients.urls import urlpatterns as client_urls
from .countries.urls import urlpatterns as country_urls
from .companies.urls import urlpatterns as company_urls
from .attendeeTypes.urls import urlpatterns as attendeeType_urls
from .companyCategory.urls import urlpatterns as companyCategory_urls
from .department.urls import urlpatterns as department_urls
from .growthClasses.urls import urlpatterns as growthClass_urls
from .jobCategory.urls import urlpatterns as jobCategory_urls
from .statuses.urls import urlpatterns as statuses_urls
app_name = "kroadmin"

urlpatterns = [
    path('login/',login,{'template_name':'kroadmin/login.html'}, name="login"),
    path('logout/',logout,{'template_name':'kroadmin/login.html'}, name="logout"),
    path('clients/', include(client_urls)),
    path('companies/', include(company_urls)),
    path('attendee-types/', include(attendeeType_urls)),
    path('company-categories/', include(companyCategory_urls)),
    path('departments/', include(department_urls)),
    path('growth-classes/', include(growthClass_urls)),
    path('job-categories/', include(jobCategory_urls)),
    path('statuses/', include(statuses_urls)),
    path('countries/', include(country_urls)),
    path('', RedirectView.as_view(pattern_name='kroadmin:company-list', permanent=False))
]
