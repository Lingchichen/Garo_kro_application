from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Company
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import CompanyTable, get_company_list
from .forms import CompanyForm, get_company_form


class CompanyList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_company_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        return context


class CompanyNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_company_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        return context


class CompanyDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_company_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        return context


class CompanyCreate(KROCreateView):
    model = Company
    fields = ['name', 'address', 'city', 'postal_code', 'province', 'country', 'client_date', 'category', 'logo_file', 'year_end']
    
    def get_success_url(self):
        return reverse('kroadmin:company-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        context['components'] = [
            get_company_form(self.request, form_data=self.request.POST)
        ]
        
        return context


class CompanyUpdate(KROUpdateView):
    model = Company
    fields = ['name', 'address', 'city', 'postal_code', 'province', 'country', 'client_date', 'category', 'logo_file', 'year_end']
    
    def get_success_url(self):
        return reverse('kroadmin:company-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        context['components'] = [
            get_company_form(self.request, form_data=self.request.POST)
        ]
        return context


class CompanyDelete(KRODeleteView):
    model = Company
    success_url = reverse_lazy('kroadmin:company-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        return context

class CompanyBulkDelete(KROBulkDeleteView):
    model = Company

    def get_success_url(self, objects):
        return reverse('kroadmin:company-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        return context
