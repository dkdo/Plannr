from . import views
from django.conf.urls import url

app_name = 'position'
urlpatterns = [
    url(r'^positionList/$', views.PositionList.as_view()),
]
