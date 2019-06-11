from django.shortcuts import get_object_or_404
from django.forms import DateInput
from django.urls import reverse
from django.forms import ModelForm
from backend.kro.models import GrowthClass
from ..generics import get_model_form

class GrowthClassForm(ModelForm):
    class Meta:
        model = GrowthClass
        fields = ['title', 'order']

def get_growthClass_form(request, pk=None, form_data=None):
    growthClass = None
    kwargs = {
        'pk': pk,
        'form_data': form_data,
        'logo_src': 'kroadmin/working-as-one.png',
        'delete_url': '',
        'form_action': reverse('kroadmin:growthClass-create'),
        'cancel_url': reverse('kroadmin:growthClass-list')
    }

    if pk and not form_data:
        growthClass = get_object_or_404(GrowthClass, pk=pk)
        kwargs['delete_url'] = reverse('kroadmin:growthClass-delete', kwargs={'pk': growthClass.id})
        kwargs['form_action'] = reverse('kroadmin:growthClass-update', kwargs={'pk': growthClass.id})

    kwargs['breadcrumbs'] = [
        {
            'url': reverse('kroadmin:growthClass-list'),
            'text': 'GrowthClass'
        },{
            'text': growthClass.title if growthClass else 'New GrowthClass'
        }
    ]

    return get_model_form(request, GrowthClassForm, **kwargs)
