from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import Department
from ..generics import get_model_form

class DepartmentForm(ModelForm):
    class Meta:
        model = Department
        fields = ['name', 'order']

def get_department_form(request, pk=None, form_data=None):
    department = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:department-create'),
        'cancel_url': reverse('kroadmin:department-list')
    }

    if pk and not form_data:
        department = get_object_or_404(Department, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:department-delete', kwargs={'pk': department.id})
        kwargs['form_action'] = reverse('kroadmin:department-update', kwargs={'pk': department.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:department-list'),
            'text': 'Department'
        },{
            'text': department.name if department else 'New Department'
        }
    ]

    return get_model_form(request, DepartmentForm, **kwargs)
