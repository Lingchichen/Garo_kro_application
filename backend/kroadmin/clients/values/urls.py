from django.urls import path
from . import views

urlpatterns = [
    path('', views.ValueList.as_view(), name="value-list"),
    path('new/', views.ValueNew.as_view(), name='value-new'),
    path('create/', views.ValueCreate.as_view(), name='value-create'),
    path('bulk-delete/', views.ValueBulkDelete.as_view(), name="value-bulk-delete"),
    path('<int:pk>/', views.ValueDetail.as_view(), name='value-detail'),
    path('<int:pk>/update/', views.ValueUpdate.as_view(), name='value-update'),
    path('<int:pk>/delete/', views.ValueDelete.as_view(), name='value-delete'),
]
