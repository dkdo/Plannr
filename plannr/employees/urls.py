from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from employees import views

urlpatterns = [
    url(r'^$', views.EmployeesList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)