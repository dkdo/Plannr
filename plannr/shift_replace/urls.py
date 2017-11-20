from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from shift_replace import views

urlpatterns = [
    url(r'^list/$', views.ShiftCenterList.as_view()),
    url(r'^search_replace/$', views.ShiftSearchReplace.as_view()),
    url(r'^replace_request/$', views.ShiftReplaceRequest.as_view()),
    url(r'^manager_approve/$', views.ShiftManagerApprove.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)