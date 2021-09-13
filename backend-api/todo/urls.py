from django.urls import path,include

from . import views

urlpatterns=[
    path('',views.ViewCreateTaskList.as_view()),
    path('note/<str:taskID>',views.ViewCreateNote.as_view()),

    path('users-list/',views.GET_UsersListView.as_view()),
    path('sections/',views.GET_SectionView.as_view()),

    path('edit-task/<str:pk>',views.ViewTaskListUpdate.as_view()),
    path('edit-note/<str:pk>',views.ViewUpdateNote.as_view()),

    path('auth/',include('rest_auth.urls')),
    path('auth/register/',include('rest_auth.registration.urls'))
]