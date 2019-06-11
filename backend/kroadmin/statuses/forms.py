from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import Status
from ..generics import get_model_form

class StatusForm(ModelForm):
    class Meta:
        model = Status
        fields = ['title', 'order']

def get_status_form(request, pk=None, form_data=None):
    status = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:status-create'),
        'cancel_url': reverse('kroadmin:status-list')
    }

    if pk and not form_data:
        status = get_object_or_404(Status, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:status-delete', kwargs={'pk': status.id})
        kwargs['form_action'] = reverse('kroadmin:status-update', kwargs={'pk': status.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:status-list'),
            'text': 'Status'
        },{
            'text': status.title if status else 'New Status'
        }
    ]

    return get_model_form(request, StatusForm, **kwargs)
