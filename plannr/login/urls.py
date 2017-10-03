from . import views
from . import api
from django.conf.urls import url

app_name = 'login'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^loginaction/', api.SignInRequest.as_view()),
    url(r'^signupaction/', api.SignUpRequest.as_view()),
    url(r'^logoutaction/', api.SignOutRequest.as_view()),
]
