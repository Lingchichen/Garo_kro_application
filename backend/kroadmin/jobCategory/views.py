from django.shortcuts import get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView
from backend.kro.models import JobCategory
from django.contrib.auth.mixins import LoginRequiredMixin
from ..generics import KROModelView, KROCreateView, KROUpdateView, KRODeleteView, KROBulkDeleteView
from .tables import JobCategoryTable, get_jobCategory_list
from .forms import JobCategoryForm, get_jobCategory_form


class JobCategoryList(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_jobCategory_list(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        return context


class JobCategoryNew(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_jobCategory_form(self.request)]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        return context


class JobCategoryDetail(KROModelView):
    def get_rendered_components(self, **kwargs):
        return [get_jobCategory_form(self.request, pk=kwargs.get('pk'))]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        return context


class JobCategoryCreate(KROCreateView):
    model = JobCategory
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:jobCategory-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_jobCategorypage'] = 'jobCategory'
        context['components'] = [
            get_jobCategory_form(self.request, form_data=self.request.POST)
        ]

        return context


class JobCategoryUpdate(KROUpdateView):
    model = JobCategory
    fields = ['name', 'order']

    def get_success_url(self):
        return reverse('kroadmin:jobCategory-detail', kwargs={'pk': self.object.id})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        context['components'] = [
            get_jobCategory_form(self.request, form_data=self.request.POST)
        ]
        return context


class JobCategoryDelete(KRODeleteView):
    model = JobCategory
    success_url = reverse_lazy('kroadmin:jobCategory-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        return context

class JobCategoryBulkDelete(KROBulkDeleteView):
    model = JobCategory

    def get_success_url(self, objects):
        return reverse('kroadmin:jobCategory-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sidebar_page'] = 'jobCategory'
        return context