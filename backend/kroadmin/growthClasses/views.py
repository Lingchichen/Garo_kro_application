from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import GrowthClass
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import GrowthClassTable, get_growthClass_list
from .forms import GrowthClassForm, get_growthClass_form


class GrowthClassList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_growthClass_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        return context


class GrowthClassNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_growthClass_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        return context


class GrowthClassDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_growthClass_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        return context


class GrowthClassCreate(KROCreateView):
    model = GrowthClass
    fields = ['title', 'order']

    def get_success_url(self):
        return reverse('kroadmin:growthClass-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_growthClasspage'] = 'growthClass'
        context['components'] = [
            get_growthClass_form(self.request, form_data=self.request.POST)
        ]

        return context


class GrowthClassUpdate(KROUpdateView):
    model = GrowthClass
    fields = ['title', 'order']

    def get_success_url(self):
        return reverse('kroadmin:growthClass-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        context['components'] = [
            get_growthClass_form(self.request, form_data=self.request.POST)
        ]
        return context


class GrowthClassDelete(KRODeleteView):
    model = GrowthClass
    success_url = reverse_lazy('kroadmin:growthClass-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        return context

class GrowthClassBulkDelete(KROBulkDeleteView):
    model = GrowthClass

    def get_success_url(self, objects):
        return reverse('kroadmin:growthClass-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'growthClass'
        return context