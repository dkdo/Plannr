from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from event import views

urlpatterns = [
    url(r'^$', views.EventList.as_view()),
    url(r'^eventdetail/$', views.EventDetail.as_view()),
    url(r'^weekevents/$', views.WeekEvents.as_view()),
    url(r'^monthevents/$', views.MonthEvents.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)