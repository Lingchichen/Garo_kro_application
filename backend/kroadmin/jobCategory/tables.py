from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import JobCategory
from ..generics import ListComponent, ModelTable

class JobCategoryTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = JobCategory
        fields = ['name']

    def edit_url(self, record):
        return reverse('kroadmin:jobCategory-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:jobCategory-delete', kwargs={'pk': record.id})

def get_jobCategory_list(request):
    table = JobCategoryTable(JobCategory.objects.all().order_by('order'))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'JobCategory'}],
        create_url = reverse('kroadmin:jobCategory-new'),
        form_action = reverse('kroadmin:job-category-bulk-delete'),
        table = table
    )
