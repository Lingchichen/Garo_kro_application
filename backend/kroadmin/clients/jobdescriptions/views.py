from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Person,Company
from django.contrib.auth.mixins import LoginRequiredMixin
from backend.kroadmin.generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import JobDescriptionTable, get_job_description_list
from .forms import JobDescriptionForm,  get_job_description_form
from ....kro.models import JobDescription

class JobDescriptionList(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_job_description_list(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context


class JobDescriptionNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_job_description_form(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context


class JobDescriptionDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        job_description = get_object_or_404(JobDescription, pk=kwargs.get('pk'))
        return [ get_job_description_form(self.request, company, pk=job_description.id) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context


class JobDescriptionCreate(KROCreateView):
    model = JobDescription
    fields = ['title', 'company']

    def get_success_url(self):
        return reverse('kroadmin:value-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_job_description_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context


class JobDescriptionUpdate(KROUpdateView):
    model = JobDescription
    fields = ['company', 'value_type', 'title', 'statement', 'order']

    def get_success_url(self):
        return reverse('kroadmin:value-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        context['components'] = [
            get_job_description_form(self.request, company, form_data=self.request.POST)
        ]
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context


class JobDescriptionDelete(KRODeleteView):
    model = JobDescription

    def get_success_url(self):
        return reverse('kroadmin:value-list', kwargs={'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = kwargs.get('object')
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = obj.company.id
        context['sidebar_page'] = 'job-descriptions'
        return context

class JobDescriptionBulkDelete(KROBulkDeleteView):
    model = JobDescription

    def get_success_url(self, objects):
        return reverse('kroadmin:value-list', kwargs={'cpk': objects.first().company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'job-descriptions'
        return context