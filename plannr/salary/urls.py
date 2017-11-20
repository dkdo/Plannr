from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from salary import views

urlpatterns = [
    url(r'^compute_week/$', views.SalaryCompWeek.as_view()),
    url(r'^compute_month/$', views.SalaryCompMonth.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)