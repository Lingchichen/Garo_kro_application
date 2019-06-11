import django_tables2 as tables
from django.urls import reverse
from django.db.models.functions import Lower
from django_tables2 import RequestConfig
from backend.kro.models import Person,Company
from backend.kroadmin.generics import ListComponent, ModelTable

class PersonTable(ModelTable):
    full_name = tables.Column(empty_values=())

    def render_full_name(self, record):
        return '{} {}'.format(record.user.first_name, record.user.last_name)

    def edit_url(self, record):
        return reverse('kroadmin:person-detail', kwargs={'pk': record.id, 'cpk': record.company.id})

    def delete_url(self, record):
        return reverse('kroadmin:person-delete', kwargs={'pk': record.id,'cpk': record.company.id})

    class Meta(ModelTable.Meta):
        model = Person
        fields = ['employee_number','is_owner','is_manager','is_employee','is_third_party']
        sequence = ('selection', 'employee_number', 'full_name', '...', 'edit', 'delete')
    

def get_person_list(request, company):
    table = PersonTable(company.person_set.all().order_by('user__first_name', 'user__last_name'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = company.logo_file.url,
        breadcrumbs = [{ 'text': 'People' }],
        create_url = reverse('kroadmin:person-new', kwargs={'cpk': company.id}),
        table = table
    )
