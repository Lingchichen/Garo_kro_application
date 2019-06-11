from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobDescriptionList.as_view(), name="job-description-list"),
    path('new/', views.JobDescriptionNew.as_view(), name='job-description-new'),
    path('create/', views.JobDescriptionCreate.as_view(), name='job-description-create'),
    path('bulk-delete/', views.JobDescriptionBulkDelete.as_view(), name="job-description-bulk-delete"),
    path('<int:pk>/', views.JobDescriptionDetail.as_view(), name='job-description-detail'),
    path('<int:pk>/update/', views.JobDescriptionUpdate.as_view(), name='job-description-update'),
    path('<int:pk>/delete/', views.JobDescriptionDelete.as_view(), name='job-description-delete'),
]
