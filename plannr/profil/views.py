from django.shortcuts import render
from django.views.generic.base import TemplateView
from profil.serializers import ProfileSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from profil.models import Profile
from employees.models import Employees


class ProfileInfo(APIView):
    def post(self, request, format=None):
        user_id = request.user.id
        profile_exists = exists_or_not(Profile, user_id=user_id) #checks if the user has a profile page in the database
        if profile_exists:
            current_profile = Profile.objects.get(user_id=user_id)
            serializer = ProfileSerializer(current_profile, data=request.data)
        else:
            serializer = ProfileSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        if request.user.is_authenticated():
            current_user_id = request.user.id
            profile_exists = exists_or_not(Profile, user_id=current_user_id)
            if profile_exists:
                user_profile = Profile.objects.get(user_id=current_user_id)
                serializer = ProfileSerializer(user_profile)
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class Username(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated():
            current_user = request.user
            data = {'logged_in': request.user.username}
            return Response(data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class PositionChange(APIView):
    def patch(self, request, format=None):
        if request.user.is_authenticated() and self.is_manager(request):
            employee_id = request.data.get('employee_id')
            profile = Profile.objects.get(user_id=employee_id)
            new_position = {'position_id': request.data.get('position_id')}

            serializer = ProfileSerializer(profile, data=new_position,
                                           partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def is_manager(self, request):
        manager = request.user
        employee_id = request.data.get('employee_id')
        employees_list = Employees.objects.get(manager=manager,
                                               employee_id=employee_id)

        if employees_list:
            return True
        else:
            return False


def exists_or_not(classmodel, **kwargs):
    num_results = classmodel.objects.filter(**kwargs).count()
    if num_results > 0:
        return True
    else:
        return False
