from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.forms import ModelForm, HiddenInput
from backend.kro.models import CompanyDepartment
from ...generics import get_model_form

class DepartmentForm(ModelForm):
    class Meta:
        model = CompanyDepartment
        fields = ['company', 'name', 'department']
        widgets = {'company': HiddenInput()}

def get_department_form(request, company, pk=None, form_data=None):
    department = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': company.logo_file.url,
        'delete_url': '',
        'form_action': reverse('kroadmin:company-department-create', kwargs={'cpk': company.id}),
        'cancel_url': reverse('kroadmin:company-department-list', kwargs={'cpk': company.id}),
        'initial': {'company': company}
    }
    if pk and not form_data:
        department = get_object_or_404(CompanyDepartment, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:company-department-delete', kwargs={
            'cpk': department.company.id,
            'pk': department.id
        })
        kwargs['form_action'] = reverse('kroadmin:company-department-update', kwargs={
            'cpk': department.company.id,
            'pk': department.id
        })

    kwargs['breadcrumbs'] = [{
            'url': reverse('kroadmin:company-department-list', kwargs={'cpk': company.id}),
            'text': 'Departments'
        },{
            'text': department.name if pk else 'New Value'
    }]

    return get_model_form(request, DepartmentForm, **kwargs)