from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import AttendeeType
from ..generics import get_model_form

class AttendeeTypeForm(ModelForm):
    class Meta:
        model = AttendeeType
        fields = ['attendee_title', 'is_department']

def get_attendeeType_form(request, pk=None, form_data=None):
    attendeeType = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:attendeeType-create'),
        'cancel_url': reverse('kroadmin:attendeeType-list')
    }

    if pk and not form_data:
        attendeeType = get_object_or_404(AttendeeType, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:attendeeType-delete', kwargs={'pk': attendeeType.id})
        kwargs['form_action'] = reverse('kroadmin:attendeeType-update', kwargs={'pk': attendeeType.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:attendeeType-list'),
            'text': 'AttendeeType'
        },{
            'text': attendeeType.attendee_title if attendeeType else 'New Attendee Type'
        }
    ]

    return get_model_form(request, AttendeeTypeForm, **kwargs)
