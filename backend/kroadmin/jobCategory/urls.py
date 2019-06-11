from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobCategoryList.as_view(), name='jobCategory-list'),
    path('new/', views.JobCategoryNew.as_view(), name='jobCategory-new'),
    path('create/', views.JobCategoryCreate.as_view(), name='jobCategory-create'),
    path('bulk-delete/', views.JobCategoryBulkDelete.as_view(), name="job-category-bulk-delete"),
    path('<int:pk>/', views.JobCategoryDetail.as_view(), name='jobCategory-detail'),
    path('<int:pk>/update/', views.JobCategoryUpdate.as_view(), name='jobCategory-update'),
    path('<int:pk>/delete/', views.JobCategoryDelete.as_view(), name='jobCategory-delete')
]
