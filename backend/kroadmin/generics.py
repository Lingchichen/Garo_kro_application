import django_tables2 as tables
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.utils.html import format_html
from django.template.loader import render_to_string
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.views.generic import CreateView, UpdateView, DeleteView


class ModelTable(tables.Table):
    selection = tables.CheckBoxColumn(accessor='pk', orderable=False)
    edit = tables.Column(empty_values=(), orderable=False)
    delete = tables.Column(empty_values=(), orderable=False)

    def edit_url(self, record):
        return ''

    def delete_url(self, record):
        return ''

    def render_edit(self, record):
        return format_html(
            '<a href="{}"><img src="{}" alt="" /></a>',
            self.edit_url(record),
            static('kroadmin/edit.png')
        )

    def render_delete(self, record):
        return format_html(
            '<a href="{}"><img src="{}" alt="" /></a>',
            self.delete_url(record),
            static('kroadmin/trash-can.png')
        )

    class Meta:
        sequence = ('selection', '...', 'edit', 'delete')
        abstract = True
        attrs={
            'id':'table-1',

            'cellspacing':"0" ,
            'cellpadding':"2"
        }
        row_attrs = {
            'id': lambda record: record.pk,
            'class': 'myDragClass'
        }


class Component:
    template_name = 'kroadmin/component.html'

    def render(self, request=None, **kwargs):
        return render_to_string(self.template_name, request=request, context=kwargs)


class ListComponent(Component):
    template_name = 'kroadmin/list_component.html'


class FormComponent(Component):
    template_name = 'kroadmin/form_component.html'


class KROModelView(LoginRequiredMixin, TemplateView):
    login_url = reverse_lazy('kroadmin:login')
    template_name = "kroadmin/model-view.html"

    def get_rendered_components(self, **kwargs):
        return []

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['components'] = self.get_rendered_components(**kwargs)
        return context


class KROCreateView(LoginRequiredMixin, CreateView):
    login_url = reverse_lazy('kroadmin:login')
    template_name = 'kroadmin/model-view.html'


class KROUpdateView(LoginRequiredMixin, UpdateView):
    login_url = reverse_lazy('kroadmin:login')
    template_name = 'kroadmin/model-view.html'


class KRODeleteView(LoginRequiredMixin, DeleteView):
    login_url = reverse_lazy('kroadmin:login')
    template_name = 'kroadmin/confirm_delete.html'

class KROBulkDeleteView(LoginRequiredMixin, View):
    model = None
    login_url = reverse_lazy('kroadmin:login')
    template_name = 'kroadmin/confirm_bulk_delete.html'

    def get_context_data(self, **kwargs):
        return {}

    def get_success_url(self, objects):
        return ''

    def get(self, request, **kwargs):
        context = self.get_context_data(**kwargs)
        delete_ids = request.GET.getlist('selection')
        context['objects'] = self.model.objects.filter(pk__in=delete_ids)
        return render(request, self.template_name, context)

    def post(self, request, **kwargs):
        delete_ids = request.POST.getlist('delete_ids')
        objects = self.model.objects.filter(pk__in=delete_ids)
        success_url = self.get_success_url(objects)
        objects.delete()
        return redirect(success_url)


def get_model_form(request, form_class, **kwargs):
    form = form_class(initial=kwargs.get('initial'))
    if kwargs.get('form_data'):
        form = form_class(kwargs.get('form_data'), initial=kwargs.get('initial'))
    elif kwargs.get('pk'):
        obj = get_object_or_404(form_class.Meta.model, pk=kwargs.get('pk'))
        form = form_class(instance=obj)
    return FormComponent().render(
        request = request,
        logo_src = kwargs.get('logo_src'),
        breadcrumbs = kwargs.get('breadcrumbs'),
        delete_url = kwargs.get('delete_url'),
        form_action = kwargs.get('form_action'),
        cancel_url = kwargs.get('cancel_url'),
        form = form
    )
