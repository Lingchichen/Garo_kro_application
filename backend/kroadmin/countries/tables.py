from django.urls import reverse
from django.db.models.functions import Lower
from django.contrib.staticfiles.templatetags.staticfiles import static
from django_tables2 import RequestConfig
from backend.kro.models import Country, ProvinceState
from ..generics import ListComponent, ModelTable

class CountryTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = Country
        fields = ['name']
        
    def edit_url(self, record):
        return reverse('kroadmin:country-detail', kwargs={'pk': record.id})

    def delete_url(self, record):
        return reverse('kroadmin:country-delete', kwargs={'pk': record.id})

class StateTable(ModelTable):
    class Meta(ModelTable.Meta):
        model = ProvinceState
        fields = ['name']

    def edit_url(self, record):
        return reverse('kroadmin:state-detail', kwargs={'pk': record.id, 'cpk': record.country.id})

    def delete_url(self, record):
        return reverse('kroadmin:state-delete', kwargs={'pk': record.id, 'cpk': record.country.id})



def get_country_list(request):
    table = CountryTable(Country.objects.all().order_by(Lower('name')))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{'text': 'Countries'}],
        create_url = reverse('kroadmin:country-new'),
        form_action = reverse('kroadmin:country-bulk-delete'),
        table = table
    )

def get_state_list(request, country):
    table = StateTable(country.provincestate_set.all().order_by(Lower('name')))
    RequestConfig(request).configure(table)
    return ListComponent().render(
        request = request,
        logo_src = static('kroadmin/working-as-one.png'),
        breadcrumbs = [{
                'url': reverse('kroadmin:country-list'),
                'text': 'Countries'
            },{
                'url': reverse('kroadmin:country-detail', kwargs={'pk': country.id}),
                'text': country.name
            },{
                'text': 'Provinces & States'
        }],
        create_url = reverse('kroadmin:state-new', kwargs={'cpk': country.id}),
        form_action = reverse('kroadmin:state-bulk-delete', kwargs={'cpk': country.id}),
        table = table
    )
