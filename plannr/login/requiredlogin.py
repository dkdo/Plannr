from django.shortcuts import HttpResponseRedirect
from django.urls import reverse


class AuthRequiredMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if not request.user.is_authenticated():
            if not request.path == reverse('login:index'):
                return HttpResponseRedirect(reverse('login:index'))

        return response
