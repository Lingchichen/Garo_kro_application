from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Person,Company
from django.contrib.auth.mixins import LoginRequiredMixin
from backend.kroadmin.generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import DepartmentTable,get_department_list
from .forms import DepartmentForm,  get_department_form
from ....kro.models import CompanyDepartment

class DepartmentList(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_department_list(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context


class DepartmentNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_department_form(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context


class DepartmentDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        department = get_object_or_404(CompanyDepartment, pk=kwargs.get('pk'))
        return [ get_department_form(self.request, company, pk=department.id) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context


class DepartmentCreate(KROCreateView):
    model = CompanyDepartment
    fields = ['company', 'name', 'department']

    def get_success_url(self):
        return reverse('kroadmin:company-department-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_department_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context


class DepartmentUpdate(KROUpdateView):
    model = CompanyDepartment
    fields = ['company', 'name', 'department']

    def get_success_url(self):
        return reverse('kroadmin:company-department-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_department_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context


class DepartmentDelete(KRODeleteView):
    model = CompanyDepartment

    def get_success_url(self):
        return reverse('kroadmin:company-department-list', kwargs={'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = kwargs.get('object')
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = obj.company.id
        context['sidebar_page'] = 'departments'
        return context

class DepartmentBulkDelete(KROBulkDeleteView):
    model = CompanyDepartment

    def get_success_url(self, objects):
        return reverse('kroadmin:company-department-list', kwargs={'cpk': objects.first().company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'departments'
        return context