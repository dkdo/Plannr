from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from event import views

urlpatterns = [
    url(r'^$', views.EventList.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', views.EventDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)