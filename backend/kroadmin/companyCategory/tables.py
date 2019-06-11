from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import CompanyCategory
from ..generics import ListComponent, ModelTable

class CompanyCategoryTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = CompanyCategory
        fields = ['name']
        
    def edit_url(self, record):
        return reverse('kroadmin:companyCategory-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:companyCategory-delete', kwargs={'pk': record.id})

def get_companyCategory_list(request):
    table = CompanyCategoryTable(CompanyCategory.objects.all().order_by('order'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'CompanyCategory'}],
        create_url = reverse('kroadmin:companyCategory-new'),
        form_action = reverse('kroadmin:company-category-bulk-delete'),
        table = table
    )
