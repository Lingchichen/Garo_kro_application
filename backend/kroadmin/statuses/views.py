from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import Status
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import StatusTable, get_status_list
from .forms import StatusForm, get_status_form


class StatusList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_status_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        return context


class StatusNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_status_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        return context


class StatusDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_status_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        return context


class StatusCreate(KROCreateView):
    model = Status
    fields = ['title', 'order']

    def get_success_url(self):
        return reverse('kroadmin:status-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_statuspage'] = 'status'
        context['components'] = [
            get_status_form(self.request, form_data=self.request.POST)
        ]

        return context


class StatusUpdate(KROUpdateView):
    model = Status
    fields = ['title', 'order']

    def get_success_url(self):
        return reverse('kroadmin:status-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        context['components'] = [
            get_status_form(self.request, form_data=self.request.POST)
        ]
        return context


class StatusDelete(KRODeleteView):
    model = Status
    success_url = reverse_lazy('kroadmin:status-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        return context

class StatusBulkDelete(KROBulkDeleteView):
    model = Status

    def get_success_url(self, objects):
        return reverse('kroadmin:status-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'status'
        return context