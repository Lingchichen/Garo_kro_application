from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.forms import ModelForm, HiddenInput
from backend.kro.models import Country, ProvinceState
from ..generics import FormComponent, ListComponent, get_model_form

class CountryForm(ModelForm):
    class Meta:
        model = Country
        fields = ['name']

class StateForm(ModelForm):
    class Meta:
        model = ProvinceState
        fields = ['country', 'name']
        widgets = {'country': HiddenInput()}

def get_country_form(request, pk=None, form_data=None):
    country = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:country-create'),
        'cancel_url': reverse('kroadmin:country-list')
    }

    if pk and not form_data:
        country = get_object_or_404(Country, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:country-delete', kwargs={'pk': country.id})
        kwargs['form_action'] = reverse('kroadmin:country-update', kwargs={'pk': country.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:country-list'),
            'text': 'Countries'
        },{
            'text': country.name if country else 'New Country'
        }
    ]

    return get_model_form(request, CountryForm, **kwargs)

def get_state_form(request, country, pk=None, form_data=None):
    state = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:state-create', kwargs={'cpk': country.id}),
        'cancel_url': reverse('kroadmin:country-detail', kwargs={'pk': country.id}),
        'initial': {'country': country}
    }
    if pk and not form_data:
        state = get_object_or_404(ProvinceState, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:state-delete', kwargs={
            'cpk': state.country.id,
            'pk': state.id
        })
        kwargs['form_action'] = reverse('kroadmin:state-update', kwargs={
            'cpk': state.country.id,
            'pk': state.id
        })

    kwargs['breadcrumbs'] = [{
            'url': reverse('kroadmin:country-list'),
            'text': 'Countries'
        },{
            'url': reverse('kroadmin:country-detail', kwargs={'pk': country.id}),
            'text': country.name
        },{
            'text': state.name if pk else 'New State'
    }]

    return get_model_form(request, StateForm, **kwargs)
