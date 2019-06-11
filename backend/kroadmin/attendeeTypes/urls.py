from django.urls import path
from . import views

urlpatterns = [
    path('', views.AttendeeTypeList.as_view(), name='attendeeType-list'),
    path('new/', views.AttendeeTypeNew.as_view(), name='attendeeType-new'),
    path('create/', views.AttendeeTypeCreate.as_view(), name='attendeeType-create'),
    path('bulk-delete/', views.AttendeeTypeBulkDelete.as_view(), name="attendee-type-bulk-delete"),
    path('<int:pk>/', views.AttendeeTypeDetail.as_view(), name='attendeeType-detail'),
    path('<int:pk>/update/', views.AttendeeTypeUpdate.as_view(), name='attendeeType-update'),
    path('<int:pk>/delete/', views.AttendeeTypeDelete.as_view(), name='attendeeType-delete')
]
