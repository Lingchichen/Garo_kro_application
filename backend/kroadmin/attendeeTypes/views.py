from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import AttendeeType
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import AttendeeTypeTable, get_attendeeType_list
from .forms import AttendeeTypeForm, get_attendeeType_form


class AttendeeTypeList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_attendeeType_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        return context


class AttendeeTypeNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_attendeeType_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        return context


class AttendeeTypeDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_attendeeType_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        return context


class AttendeeTypeCreate(KROCreateView):
    model = AttendeeType
    fields = ['attendee_title', 'is_department']

    def get_success_url(self):
        return reverse('kroadmin:attendeeType-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_AttendeeTypepage'] = 'attendeeType'
        context['components'] = [
            get_attendeeType_form(self.request, form_data=self.request.POST)
        ]

        return context


class AttendeeTypeUpdate(KROUpdateView):
    model = AttendeeType
    fields = ['attendee_title', 'is_department']

    def get_success_url(self):
        return reverse('kroadmin:attendeeType-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        context['components'] = [
            get_attendeeType_form(self.request, form_data=self.request.POST)
        ]
        return context


class AttendeeTypeDelete(KRODeleteView):
    model = AttendeeType
    success_url = reverse_lazy('kroadmin:attendeeType-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        return context

class AttendeeTypeBulkDelete(KROBulkDeleteView):
    model = AttendeeType

    def get_success_url(self, objects):
        return reverse('kroadmin:attendeeType-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'attendeeType'
        return context
