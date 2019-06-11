from django.urls import path
from . import views

urlpatterns = [
    path('', views.DepartmentList.as_view(), name="company-department-list"),
    path('new/', views.DepartmentNew.as_view(), name='company-department-new'),
    path('create/', views.DepartmentCreate.as_view(), name='company-department-create'),
    path('bulk-delete/', views.DepartmentBulkDelete.as_view(), name="company-department-bulk-delete"),
    path('<int:pk>/', views.DepartmentDetail.as_view(), name='company-department-detail'),
    path('<int:pk>/update/', views.DepartmentUpdate.as_view(), name='company-department-update'),
    path('<int:pk>/delete/', views.DepartmentDelete.as_view(), name='company-department-delete'),
]
