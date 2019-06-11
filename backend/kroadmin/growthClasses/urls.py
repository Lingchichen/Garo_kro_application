from django.urls import path
from . import views

urlpatterns = [
    path('', views.GrowthClassList.as_view(), name='growthClass-list'),
    path('new/', views.GrowthClassNew.as_view(), name='growthClass-new'),
    path('create/', views.GrowthClassCreate.as_view(), name='growthClass-create'),
    path('bulk-delete/', views.GrowthClassBulkDelete.as_view(), name="growth-class-bulk-delete"),
    path('<int:pk>/', views.GrowthClassDetail.as_view(), name='growthClass-detail'),
    path('<int:pk>/update/', views.GrowthClassUpdate.as_view(), name='growthClass-update'),
    path('<int:pk>/delete/', views.GrowthClassDelete.as_view(), name='growthClass-delete')
]
