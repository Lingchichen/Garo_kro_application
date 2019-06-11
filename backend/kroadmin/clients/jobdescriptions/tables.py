import django_tables2 as tables
from django.urls import reverse
from django.db.models.functions import Lower
from django_tables2 import RequestConfig
from backend.kro.models import Value,Company
from backend.kroadmin.generics import ListComponent, ModelTable

class ValueTable(ModelTable):
    def edit_url(self, record):
        return reverse('kroadmin:value-detail', kwargs={'pk': record.id, 'cpk': record.company.id})

    def delete_url(self, record):
        return reverse('kroadmin:value-delete', kwargs={'pk': record.id,'cpk': record.company.id})

    class Meta(ModelTable.Meta):
        model = Value
        fields = ['title', 'value_type']
    

def get_value_list(request, company):
    table = ValueTable(company.value_set.all().order_by('order'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = company.logo_file.url,
        breadcrumbs = [{ 'text': 'Values' }],
        create_url = reverse('kroadmin:value-new', kwargs={'cpk': company.id}),
        form_action = reverse('kroadmin:value-bulk-delete', kwargs={'cpk': company.id}),
        table = table
    )
