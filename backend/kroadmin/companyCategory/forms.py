from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import CompanyCategory
from ..generics import get_model_form

class CompanyCategoryForm(ModelForm):
    class Meta:
        model = CompanyCategory
        fields = ['name', 'order']

def get_companyCategory_form(request, pk=None, form_data=None):
    companyCategory = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:companyCategory-create'),
        'cancel_url': reverse('kroadmin:companyCategory-list')
    }

    if pk and not form_data:
        companyCategory = get_object_or_404(CompanyCategory, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:companyCategory-delete', kwargs={'pk': companyCategory.id})
        kwargs['form_action'] = reverse('kroadmin:companyCategory-update', kwargs={'pk': companyCategory.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:companyCategory-list'),
            'text': 'CompanyCategory'
        },{
            'text': companyCategory.name if companyCategory else 'New Company Category'
        }
    ]

    return get_model_form(request, CompanyCategoryForm, **kwargs)
