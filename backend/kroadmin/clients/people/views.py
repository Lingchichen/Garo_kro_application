from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Person,Company
from django.contrib.auth.mixins import LoginRequiredMixin
from backend.kroadmin.generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView
from .tables import PersonTable,get_person_list
from .forms import PersonForm,  get_person_form
from ....kro.models import Company

class PeopleList(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [ get_person_list(self.request, company) ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'people'
        return context


class PeopleNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        return [get_person_form(self.request,company)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['companies'] = Company.objects.all()
        context['selected_company'] = kwargs.get('cpk')
        context['sidebar_page'] = 'people'
        return context


class PeopleDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        person = get_object_or_404(Person, pk=kwargs.get('pk'))
        return [get_person_form(self.request, person.company,pk=person.id)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        context['sidebar_page'] = 'people'
        context['selected_company'] = kwargs.get('cpk')
        context['companies'] = Company.objects.all()
        return context


class PeopleCreate(KROCreateView):
    model = Person
    fields = ['user','phone','company','is_owner','is_manager','is_employee','is_third_party','job_description','join_date','position_date','employee_number','picture_width','picture_height','picture_file']


    def get_success_url(self):
        return reverse('kroadmin:person-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_clients'] = True
        company = get_object_or_404(Company, pk=kwargs.get('cpk'))
        print(company)
        context['companies'] = Company.objects.all()
        context['components'] = [
            get_person_form(self.request,company, form_data=self.request.POST)
        ]

        return context


class PeopleUpdate(KROUpdateView):
    model = Person
    fields = ['user','phone','company','is_owner','is_manager','is_employee','is_third_party','job_description','join_date','position_date','employee_number','picture_width','picture_height','picture_file']

    def get_success_url(self):
        return reverse('kroadmin:company-detail', kwargs={'pk': self.object.id,'cpk': self.object.company.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        context['sidebar_clients'] = True
        context['selected_company'] = kwargs.get('cpk')
        context['companies'] = Company.objects.all()
        context['components'] = [
            get_person_form(self.request, form_data=self.request.POST)
        ]
        return context


class PeopleDelete(KRODeleteView):
    model = Person
    success_url = reverse_lazy('kroadmin:person-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'companies'
        context['sidebar_clients'] = True
        context['selected_company'] = kwargs.get('cpk')
        return context
