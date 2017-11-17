# -*- coding: utf-8 -*-
"""
plannr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
from calendr.views import CalendrView


react_routes = getattr(settings, 'REACT_ROUTES', [])

urlpatterns = [
    url(r'^', include('calendr.urls'), name='homepage'),
    url(r'^profil/', include('profil.urls')),
    url(r'^login/', include('login.urls')),
    url(r'^calendr/', include('calendr.urls')),
    url(r'^position/', include('position.urls')),
    url(r'^events/', include('event.urls')),
    url(r'^employees/', include('employees.urls')),
    url(r'^salary/', include('salary.urls')),
    url(r'^shift/', include('shift_replace.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^(%s)?$' % '|'.join(react_routes), CalendrView.as_view()),
    url(r'^.*$', RedirectView.as_view(url='/', permanent=False), name='index'),
]
