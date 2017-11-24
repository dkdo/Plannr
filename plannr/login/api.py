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
from organization.serializers import OrganizationSerializer
from organization.models import Organization
from profil.serializers import ProfileSerializer
from profil.models import Profile
from employees.models import Employees
from stats.models import Stat
from stats.serializers import StatSerializer


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
        organization_name = request.POST['organization']
        create_org = False
        ismanager = False

        if organization_name is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if type(organization_name) is unicode:
            organization_name = organization_name.encode('utf-8')

        user = User.objects.create_user(email, email, password)
        user.first_name = first_name
        user.last_name = last_name
        if user is not None:
            print "USER CREATED SUCCESSFULLY"
            organization_name = str.lower(organization_name)
            org_db = Organization.objects.filter(organization_name=organization_name)

            #if organization already exists
            if org_db:
                org_id = org_db[0].id
                manager = Profile.objects.get(ismanager=True, organization_id=org_id)
                Employees.objects.create(manager_id=manager.user_id, employee_id=user.id)

            #if the organization does not exist
            else:
                org_data = {'organization_name': organization_name}
                org_serializer = OrganizationSerializer(data=org_data)

                if org_serializer.is_valid():
                    org_serializer.save()
                    org_id = org_serializer.data.get('id')
                    ismanager = True
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            if ismanager is False:
                stat_serializer = StatSerializer(data={}, context={'user': user})
                stat_serializer.is_valid(raise_exception=True)

            prof_data = {'first_name': first_name,
                         'last_name': last_name,
                         'email': email,
                         'organization_id': org_id,
                         'ismanager': ismanager}
            prof_serializer = ProfileSerializer(data=prof_data,
                                                context={'user': user})

            if prof_serializer.is_valid():
                user.save()
                prof_serializer.save()
                if not ismanager:
                    stat_serializer.save()
                print "PROFILE CREATED SUCCESSFULLY"
                print "STAT PROFILE SUCCESS"
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            print "UNSUCCESSFUL CREATION"
            return Response(status=status.HTTP_400_BAD_REQUEST)
