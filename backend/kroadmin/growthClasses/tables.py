from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import GrowthClass
from ..generics import ListComponent, ModelTable

class GrowthClassTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = GrowthClass
        fields = ['title']

    def edit_url(self, record):
        return reverse('kroadmin:growthClass-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:growthClass-delete', kwargs={'pk': record.id})

def get_growthClass_list(request):
    table = GrowthClassTable(GrowthClass.objects.all().order_by('order'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'GrowthClass'}],
        create_url = reverse('kroadmin:growthClass-new'),
        form_action = reverse('kroadmin:growth-class-bulk-delete'),
        table = table
    )
