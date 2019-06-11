from django.urls import path
from django.conf.urls import include
from django.views.generic import RedirectView
from backend.kro.models import Company
from django.db.models.functions import Lower
from django.shortcuts import redirect
from .people.urls import urlpatterns as people_urls
from .values.urls import urlpatterns as value_urls
from .departments.urls import urlpatterns as department_urls

def client_root_view(request):
    company = Company.objects.all().order_by(Lower('name')).first()
    return redirect('kroadmin:people-list', cpk=company.id)

urlpatterns = [
    path('<int:cpk>/people/', include(people_urls)),
    path('<int:cpk>/values/', include(value_urls)),
    path('<int:cpk>/departments/', include(department_urls)),
    path('', client_root_view, name="clients")
]
