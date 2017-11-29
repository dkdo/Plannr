from django.contrib.auth import views as auth_views
from . import api
from django.conf.urls import url

app_name = 'login'
urlpatterns = [
    url(r'^$', auth_views.login, {'template_name': 'registration/login.html', 'redirect_authenticated_user': True}, name='index'),
    url(r'^loginaction/', api.SignInRequest.as_view()),
    url(r'^signupaction/', api.SignUpRequest.as_view()),
    url(r'^logoutaction/', api.SignOutRequest.as_view()),
]
