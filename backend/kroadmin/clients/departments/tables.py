import django_tables2 as tables
from django.urls import reverse
from django.db.models.functions import Lower
from django_tables2 import RequestConfig
from backend.kro.models import CompanyDepartment,Company
from backend.kroadmin.generics import ListComponent, ModelTable

class DepartmentTable(ModelTable):
    def edit_url(self, record):
        return reverse('kroadmin:company-department-detail', kwargs={'pk': record.id, 'cpk': record.company.id})

    def delete_url(self, record):
        return reverse('kroadmin:company-department-delete', kwargs={'pk': record.id,'cpk': record.company.id})

    class Meta(ModelTable.Meta):
        model = CompanyDepartment
        fields = ['name', 'department']
    

def get_department_list(request, company):
    table = DepartmentTable(company.companydepartment_set.all().order_by('name'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = company.logo_file.url,
        breadcrumbs = [{ 'text': 'Departments' }],
        create_url = reverse('kroadmin:company-department-new', kwargs={'cpk': company.id}),
        form_action = reverse('kroadmin:company-department-bulk-delete', kwargs={'cpk': company.id}),
        table = table
    )
