from django.urls import path
from . import views

urlpatterns = [
    path('', views.DepartmentList.as_view(), name='department-list'),
    path('new/', views.DepartmentNew.as_view(), name='department-new'),
    path('create/', views.DepartmentCreate.as_view(), name='department-create'),
    path('bulk-delete/', views.DepartmentBulkDelete.as_view(), name="department-bulk-delete"),
    path('<int:pk>/', views.DepartmentDetail.as_view(), name='department-detail'),
    path('<int:pk>/update/', views.DepartmentUpdate.as_view(), name='department-update'),
    path('<int:pk>/delete/', views.DepartmentDelete.as_view(), name='department-delete')
]
