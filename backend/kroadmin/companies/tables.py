from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import Company
from ..generics import ListComponent, ModelTable


class CompanyTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = Company
        fields = ['name', 'city', 'category']

    def edit_url(self, record):
        return reverse('kroadmin:company-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:company-delete', kwargs={'pk': record.id})

def get_company_list(request):
    table = CompanyTable(Company.objects.all().order_by(Lower('name')))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'Companies'}],
        create_url = reverse('kroadmin:company-new'),
        form_action = reverse('kroadmin:company-bulk-delete'),
        table = table
    )
