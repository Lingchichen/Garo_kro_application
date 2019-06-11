from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import AttendeeType
from ..generics import ListComponent, ModelTable

class AttendeeTypeTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = AttendeeType
        fields = ['attendee_title', 'is_department']

    def edit_url(self, record):
        return reverse('kroadmin:attendeeType-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:attendeeType-delete', kwargs={'pk': record.id})

def get_attendeeType_list(request):
    table = AttendeeTypeTable(AttendeeType.objects.all())
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'AttendeeType'}],
        create_url = reverse('kroadmin:attendeeType-new'),
        form_action = reverse('kroadmin:attendee-type-bulk-delete'),
        table = table
    )
