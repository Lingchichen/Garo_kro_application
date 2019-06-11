from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Person,Company
from django.contrib.auth.mixins import LoginRequiredMixin
from backend.kroadmin.generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import ValueTable,get_value_list
from .forms import ValueForm,  get_value_form
from ....kro.models import Value

class ValueList(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_value_list(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'values'
        return context


class ValueNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_value_form(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'people'
        return context


class ValueDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        value = get_object_or_404(Value, pk=kwargs.get('pk'))
        return [ get_value_form(self.request, company, pk=value.id) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'values'
        return context


class ValueCreate(KROCreateView):
    model = Value
    fields = ['company', 'value_type', 'title', 'statement', 'order']

    def get_success_url(self):
        return reverse('kroadmin:value-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_value_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'values'
        return context


class ValueUpdate(KROUpdateView):
    model = Value
    fields = ['company', 'value_type', 'title', 'statement', 'order']

    def get_success_url(self):
        return reverse('kroadmin:value-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_value_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'values'
        return context


class ValueDelete(KRODeleteView):
    model = Value

    def get_success_url(self):
        return reverse('kroadmin:value-list', kwargs={'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = kwargs.get('object')
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = obj.company.id
        context['sidebar_page'] = 'values'
        return context

class ValueBulkDelete(KROBulkDeleteView):
    model = Value

    def get_success_url(self, objects):
        return reverse('kroadmin:value-list', kwargs={'cpk': objects.first().company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'values'
        return context