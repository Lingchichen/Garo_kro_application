from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import Department
from ..generics import ListComponent, ModelTable

class DepartmentTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = Department
        fields = ['name']

    def edit_url(self, record):
        return reverse('kroadmin:department-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:department-delete', kwargs={'pk': record.id})

def get_department_list(request):
    table = DepartmentTable(Department.objects.all().order_by('order'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'Department'}],
        create_url = reverse('kroadmin:department-new'),
        form_action = reverse('kroadmin:department-bulk-delete'),
        table = table
    )
