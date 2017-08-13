from django.shortcuts import render
from django.views.generic.base import TemplateView


def index(request):
    return render(request, 'calendr/index.html')


class CalendrView(TemplateView):
    template_name = "calendr/index.html"