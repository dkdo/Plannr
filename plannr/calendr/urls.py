from . import views
from django.conf.urls import url

app_name = 'calendr'
urlpatterns = [
    url(r'^$', views.index, name='index'),
]
