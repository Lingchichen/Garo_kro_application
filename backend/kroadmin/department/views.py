from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Department
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import DepartmentTable, get_department_list
from .forms import DepartmentForm, get_department_form


class DepartmentList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_department_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        return context


class DepartmentNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_department_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        return context


class DepartmentDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_department_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        return context


class DepartmentCreate(KROCreateView):
    model = Department
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:department-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_departmentpage'] = 'department'
        context['components'] = [
            get_department_form(self.request, form_data=self.request.POST)
        ]

        return context


class DepartmentUpdate(KROUpdateView):
    model = Department
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:department-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        context['components'] = [
            get_department_form(self.request, form_data=self.request.POST)
        ]
        return context


class DepartmentDelete(KRODeleteView):
    model = Department
    success_url = reverse_lazy('kroadmin:department-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        return context


class DepartmentBulkDelete(KROBulkDeleteView):
    model = Department

    def get_success_url(self, objects):
        return reverse('kroadmin:department-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'department'
        return context