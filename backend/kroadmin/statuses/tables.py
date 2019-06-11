from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import Status
from ..generics import ListComponent, ModelTable

class StatusTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = Status
        fields = ['title']

    def edit_url(self, record):
        return reverse('kroadmin:status-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:status-delete', kwargs={'pk': record.id})

def get_status_list(request):
    table = StatusTable(Status.objects.all())
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'Status'}],
        create_url = reverse('kroadmin:status-new'),
        form_action = reverse('kroadmin:status-bulk-delete'),
        table = table
    )
