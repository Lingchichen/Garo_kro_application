from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import JobCategory
from ..generics import get_model_form

class JobCategoryForm(ModelForm):
    class Meta:
        model = JobCategory
        fields = ['name', 'order']

def get_jobCategory_form(request, pk=None, form_data=None):
    jobCategory = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:jobCategory-create'),
        'cancel_url': reverse('kroadmin:jobCategory-list')
    }

    if pk and not form_data:
        jobCategory = get_object_or_404(JobCategory, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:jobCategory-delete', kwargs={'pk': jobCategory.id})
        kwargs['form_action'] = reverse('kroadmin:jobCategory-update', kwargs={'pk': jobCategory.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:jobCategory-list'),
            'text': 'JobCategory'
        },{
            'text': jobCategory.name if jobCategory else 'New JobCategory'
        }
    ]

    return get_model_form(request, JobCategoryForm, **kwargs)
