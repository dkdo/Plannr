from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from salary import views

urlpatterns = [
    url(r'^compute/$', views.SalaryComp.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)