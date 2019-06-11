from django.urls import path
from . import views

urlpatterns = [
    path('', views.StatusList.as_view(), name='status-list'),
    path('new/', views.StatusNew.as_view(), name='status-new'),
    path('create/', views.StatusCreate.as_view(), name='status-create'),
    path('bulk-delete/', views.StatusBulkDelete.as_view(), name="status-bulk-delete"),
    path('<int:pk>/', views.StatusDetail.as_view(), name='status-detail'),
    path('<int:pk>/update/', views.StatusUpdate.as_view(), name='status-update'),
    path('<int:pk>/delete/', views.StatusDelete.as_view(), name='status-delete')
]
