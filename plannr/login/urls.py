from . import views
from django.conf.urls import url

app_name = 'login'
urlpatterns = [
    url('r^login/$', views.login, name='login'),
]
