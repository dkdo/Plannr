from . import views
from django.conf.urls import url
from profil import views

app_name = 'profil'
urlpatterns = [
    url(r'^profileInfo/$', views.ProfileInfo.as_view()),
]