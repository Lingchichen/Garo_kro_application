from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.CompanyNew.as_view(), name='company-new'),
    path('create/', views.CompanyCreate.as_view(), name='company-create'),
    path('bulk-delete/', views.CompanyBulkDelete.as_view(), name="company-bulk-delete"),
    path('<int:pk>/', views.CompanyDetail.as_view(), name='company-detail'),
    path('<int:pk>/update/', views.CompanyUpdate.as_view(), name='company-update'),
    path('<int:pk>/delete/', views.CompanyDelete.as_view(), name='company-delete'),
    path('', views.CompanyList.as_view(), name='company-list'),
]