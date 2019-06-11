from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import Company
from ..generics import get_model_form

class CompanyForm(ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'address', 'city', 'postal_code', 'province', 'country', 'client_date', 'category', 'logo_file', 'year_end']
        widgets = {
            'client_date': DateInput(attrs={'class': 'datepicker'}),
            'year_end': DateInput(attrs={'class': 'datepicker'})
        }

def get_company_form(request, pk=None, form_data=None):
    company = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:company-create'),
        'cancel_url': reverse('kroadmin:company-list')
    }

    if pk and not form_data:
        company = get_object_or_404(Company, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:company-delete', kwargs={'pk': company.id})
        kwargs['form_action'] = reverse('kroadmin:company-update', kwargs={'pk': company.id})
    
    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:company-list'),
            'text': 'Companies'
        },{
            'text': company.name if company else 'New Company'
        }
    ]

    return get_model_form(request, CompanyForm, **kwargs)
