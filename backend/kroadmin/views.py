from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Country, ProvinceState,AttendeeType
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView
from .tables import StateTable, CountryTable, get_country_list, get_state_list, AttendeeTypeTable, get_attendeeType_list,
from .forms import StateForm, CountryForm, get_country_form, get_state_form, AttendeeTypeForm, get_attendeeType_form,

class CountryList(KROModelView):
    login_url = reverse_lazy('kroadmin:login')

    def get_rendered_components(self, **kwargs):
        return [get_country_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'countries'
        return context

class CountryNew(KROModelView):
    login_url = reverse_lazy('kroadmin:login')

    def get_rendered_components(self, **kwargs):
        return [get_country_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'countries'
        return context

class CountryDetail(KROModelView):
    login_url = reverse_lazy('kroadmin:login')

    def get_rendered_components(self, **kwargs):
        components = []
        country = get_object_or_404(Country, pk=kwargs.get('pk'))
        components.append(get_country_form(self.request, pk=kwargs.get('pk')))
        state_table = StateTable(country.provincestate_set.all())
        components.append(get_state_list(self.request, country))
        return components

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        return context

class StateDetail(KROModelView):
    login_url = reverse_lazy('kroadmin:login')

    def get_rendered_components(self, **kwargs):
        components = []
        state = get_object_or_404(ProvinceState, pk=kwargs.get('pk'))
        components.append(get_country_form(self.request, pk=kwargs.get('cpk')))
        components.append(get_state_form(self.request, state.country, pk=state.id))
        return components

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        return context

class StateNew(KROModelView):
    login_url = reverse_lazy('kroadmin:login')

    def get_rendered_components(self, **kwargs):
        country = get_object_or_404(Country, pk=kwargs.get('cpk'))
        return [
            get_country_form(self.request, pk=country.id),
            get_state_form(self.request, country)
        ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        return context

class CountryCreate(KROCreateView):
    model = Country
    fields = ['name']

    def get_success_url(self):
        return reverse('kroadmin:country-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'countries'
        context['components'] = [
            get_country_form(self.request, form_data=self.request.POST)
        ]
        return context

class CountryUpdate(KROUpdateView):
    model = Country
    fields = ['name']

    def get_success_url(self):
        return reverse('kroadmin:country-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        context['components'] = [
            get_country_form(self.request, form_data=self.request.POST)
        ]
        return context

class CountryDelete(KRODeleteView):
    model = Country
    success_url = reverse_lazy('kroadmin:country-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        return context


class StateCreate(KROCreateView):
    model = ProvinceState
    fields = ['country', 'name']

    def get_success_url(self):
        return reverse('kroadmin:state-detail', kwargs={'pk': self.object.id, 'cpk': self.object.country.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        country = get_object_or_404(Country, pk=kwargs.get('cpk'))
        context['components'] = [
            get_country_form(self.request, country.id),
            get_state_form(self.request, country, form_data=self.request.POST)
        ]
        return context

class StateUpdate(KROUpdateView):
    model = ProvinceState
    fields = ['name']

    def get_success_url(self):
        return reverse('kroadmin:state-detail', kwargs={'pk': self.object.id, 'cpk': self.object.country.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        country = get_object_or_404(Country, pk=kwargs.get('cpk'))
        context['components'] = [
            get_country_form(self.request, country.id),
            get_state_form(self.request, country, form_data=self.request.POST)
        ]
        return context

class StateDelete(KRODeleteView):
    model = ProvinceState

    def get_success_url(self):
        return reverse('kroadmin:country-detail', kwargs={'pk': self.object.country.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'states'
        return context
