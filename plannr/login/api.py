from event.models import Event
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from event.serializers import EventSerializer
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate as django_auth
from django.contrib.auth import login as django_login
from django.shortcuts import redirect

class SignInRequest(APIView):
    def post(self, request, format=None):
        username = request.POST['username']
        print "signin username:" + username
        password = request.POST['password']
        print "signin password:" + password
        user = django_auth(username=username, password=password)
        if user is not None:
            django_login(request, user)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SignUpRequest(APIView):
    def post(self, request, format=None):
        firstname = request.POST['firstname']
        print "signup firstname: " + firstname
        lastname = request.POST['lastname']
        print "signup lastname: " + lastname
        email = request.POST['email']
        print "signup email: " + email
        password = request.POST['password']
        print "signup password: " + password
        try:
            user = User.objects.create_user(email, email, password)
            user.first_name = firstname
            user.last_name = lastname
            if user is not None:
                user.save()
                print "CREATED SUCCESSFULLY"
                return Response(status=status.HTTP_201_CREATED)
            else:
                print "UNSUCCESSFUL CREATION"
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            print "ERROR ERROR ERROR"