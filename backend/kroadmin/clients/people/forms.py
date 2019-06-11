from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.forms import ModelForm, HiddenInput
from backend.kro.models import Person, StrengthAssessment,PerformanceReview,Company
from backend.kroadmin.generics import FormComponent, ListComponent, get_model_form

class PersonForm(ModelForm):
    class Meta:
        model = Person
        fields = ['user','phone','company','is_owner','is_manager','is_employee','is_third_party','job_description','join_date','position_date','employee_number','picture_width','picture_height','picture_file']
        widgets = {'company': HiddenInput()}

def get_person_form(request, company, pk=None, form_data=None):
    person = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': company.logo_file.url,
        'delete_url': '',
        'form_action': reverse('kroadmin:person-create',kwargs={ 'cpk': company.id}),
        'cancel_url': reverse('kroadmin:people-list',kwargs={ 'cpk': company.id}),
        'initial':{'company':company}
    }

    if pk and not form_data:
        person = get_object_or_404(Person, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:person-delete', kwargs={
            'pk': person.id,
            'cpk':company.id
        })
        kwargs['form_action'] = reverse('kroadmin:person-update', kwargs={
            'pk': person.id,
            'cpk':company.id
        })

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:people-list', kwargs={'cpk': company.id}),
            'text': 'People'
        },{
            'text': '{} {}'.format(person.user.first_name, person.user.last_name) if person else 'New person'
        }
    ]

    return get_model_form(request, PersonForm, **kwargs)



'''
    company = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:company-create'),
        'cancel_url': reverse('kroadmin:company-list')
    }

    if pk and not form_data:
        company = get_object_or_404(Company, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:company-delete', kwargs={'pk': company.id})
        kwargs['form_action'] = reverse('kroadmin:company-update', kwargs={'pk': company.id})
    
    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:company-list'),
            'text': 'Companies'
        },{
            'text': company.name if company else 'New Company'
        }
    ]

    return get_model_form(request, CompanyForm, **kwargs)
'''