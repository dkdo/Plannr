from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from stats import views

urlpatterns = [
    url(r'^stat_list/$', views.StatList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
