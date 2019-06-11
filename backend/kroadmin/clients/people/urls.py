from django.urls import path
from . import views

urlpatterns = [
    path('', views.PeopleList.as_view(), name="people-list"),
    path('new/', views.PeopleNew.as_view(), name='person-new'),
    path('create/', views.PeopleCreate.as_view(), name='person-create'),
    # path('bulk-delete/', views.PeopleBulkDelete.as_view(), name="person-bulk-delete"),
    path('<int:pk>/', views.PeopleDetail.as_view(), name='person-detail'),
    path('<int:pk>/update/', views.PeopleUpdate.as_view(), name='person-update'),
    path('<int:pk>/delete/', views.PeopleDelete.as_view(), name='person-delete'),
]
