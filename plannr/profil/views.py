from django.shortcuts import render
from django.views.generic.base import TemplateView


def index(request):
    return render(request, 'profil/profil.html')