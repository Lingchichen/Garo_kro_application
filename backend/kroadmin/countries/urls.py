from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.CountryNew.as_view(), name='country-new'),
    path('create/', views.CountryCreate.as_view(), name='country-create'),
    path('bulk-delete/', views.CountryBulkDelete.as_view(), name="country-bulk-delete"),
    path('<int:pk>/', views.CountryDetail.as_view(), name='country-detail'),
    path('<int:pk>/update/', views.CountryUpdate.as_view(), name='country-update'),
    path('<int:pk>/delete/', views.CountryDelete.as_view(), name='country-delete'),
    
    path('<int:cpk>/states/new/', views.StateNew.as_view(), name='state-new'),
    path('<int:cpk>/states/create/', views.StateCreate.as_view(), name='state-create'),
    path('<int:cpk>/states/bulk-delete/', views.StateBulkDelete.as_view(), name="state-bulk-delete"),
    path('<int:cpk>/states/<int:pk>/', views.StateDetail.as_view(), name='state-detail'),
    path('<int:cpk>/states/<int:pk>/update/', views.StateUpdate.as_view(), name='state-update'),
    path('<int:cpk>/states/<int:pk>/delete/', views.StateDelete.as_view(), name='state-delete'),
    path('', views.CountryList.as_view(), name='country-list')
]