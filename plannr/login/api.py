from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate as django_auth
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.shortcuts import redirect
from profil.serializers import ProfileSerializer
from profil.models import Profile

class SignOutRequest(APIView):
    def post(self, request, format=None):
        print "Went into the sign out request"
        if request.user.is_authenticated():
            django_logout(request)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SignInRequest(APIView):
    def post(self, request, format=None):
        username = request.POST['username']
        print "signin username:" + username
        password = request.POST['password']
        print "signin password:" + password
        try:
            user = django_auth(username=username, password=password)
            if user is not None:
                django_login(request, user)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            print "SIGN IN ERROR"

class SignUpRequest(APIView):
    def post(self, request, format=None):
        first_name = request.POST['firstname']
        last_name = request.POST['lastname']
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.create_user(email, email, password)
            user.first_name = first_name
            user.last_name = last_name
            if user is not None:
                user.save()
                print "USER CREATED SUCCESSFULLY"
                try:
                    data = {'first_name': first_name, 'last_name': last_name, 'email': email}
                    serializer = ProfileSerializer(data=data, context={'user': user})
                    if serializer.is_valid():
                        serializer.save()
                        print "PROFILE CREATED SUCCESSFULLY"
                        return Response(status=status.HTTP_201_CREATED)
                    else: 
                        return Response(status=status.HTTP_400_BAD_REQUEST)

                except:
                    print "PROFILE CREATION ERROR"
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                print "UNSUCCESSFUL CREATION"
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            print "SIGN UP ERROR"
            return Response(status=status.HTTP_400_BAD_REQUEST)