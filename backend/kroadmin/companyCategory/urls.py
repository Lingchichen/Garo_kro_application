from django.urls import path
from . import views

urlpatterns = [
    path('', views.CompanyCategoryList.as_view(), name='companyCategory-list'),
    path('new/', views.CompanyCategoryNew.as_view(), name='companyCategory-new'),
    path('create/', views.CompanyCategoryCreate.as_view(), name='companyCategory-create'),
    path('bulk-delete/', views.CompanyCategoryBulkDelete.as_view(), name="company-category-bulk-delete"),
    path('<int:pk>/', views.CompanyCategoryDetail.as_view(), name='companyCategory-detail'),
    path('<int:pk>/update/', views.CompanyCategoryUpdate.as_view(), name='companyCategory-update'),
    path('<int:pk>/delete/', views.CompanyCategoryDelete.as_view(), name='companyCategory-delete')
]
