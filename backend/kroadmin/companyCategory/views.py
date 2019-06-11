from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import CompanyCategory
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import CompanyCategoryTable, get_companyCategory_list
from .forms import CompanyCategoryForm, get_companyCategory_form


class CompanyCategoryList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_companyCategory_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        return context


class CompanyCategoryNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_companyCategory_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        return context


class CompanyCategoryDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_companyCategory_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        return context


class CompanyCategoryCreate(KROCreateView):
    model = CompanyCategory
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:companyCategory-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_CompanyCategorypage'] = 'companyCategory'
        context['components'] = [
            get_companyCategory_form(self.request, form_data=self.request.POST)
        ]

        return context


class CompanyCategoryUpdate(KROUpdateView):
    model = CompanyCategory
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:companyCategory-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        context['components'] = [
            get_companyCategory_form(self.request, form_data=self.request.POST)
        ]
        return context


class CompanyCategoryDelete(KRODeleteView):
    model = CompanyCategory
    success_url = reverse_lazy('kroadmin:companyCategory-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        return context

class CompanyCategoryBulkDelete(KROBulkDeleteView):
    model = CompanyCategory

    def get_success_url(self, objects):
        return reverse('kroadmin:companyCategory-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companyCategory'
        return context