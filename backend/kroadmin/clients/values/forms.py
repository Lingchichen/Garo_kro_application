from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.forms import ModelForm, HiddenInput
from backend.kro.models import Value
from ...generics import get_model_form

class ValueForm(ModelForm):
    class Meta:
        model = Value
        fields = ['company', 'value_type', 'title', 'statement', 'order']
        widgets = {'company': HiddenInput()}

def get_value_form(request, company, pk=None, form_data=None):
    value = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': company.logo_file.url,
        'delete_url': '',
        'form_action': reverse('kroadmin:value-create', kwargs={'cpk': company.id}),
        'cancel_url': reverse('kroadmin:value-list', kwargs={'cpk': company.id}),
        'initial': {'company': company}
    }
    if pk and not form_data:
        value = get_object_or_404(Value, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:value-delete', kwargs={
            'cpk': value.company.id,
            'pk': value.id
        })
        kwargs['form_action'] = reverse('kroadmin:value-update', kwargs={
            'cpk': value.company.id,
            'pk': value.id
        })

    kwargs['breadcrumbs'] = [{
            'url': reverse('kroadmin:value-list', kwargs={'cpk': company.id}),
            'text': 'Values'
        },{
            'text': value.title if pk else 'New Value'
    }]

    return get_model_form(request, ValueForm, **kwargs)