from django.shortcuts import render
from django.views.generic.base import TemplateView
from profil.serializers import ProfileSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from profil.models import Profile


class ProfileInfo(APIView):
	def post(self, request, format=None):
		print "went into profileInfo"
		user_id = request.user.id
		serializer = ProfileSerializer(data=request.data, context={'request' : request})
		print serializer
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		print serializer.errors
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def get(self, request, format=None):
		if request.user.is_authenticated():
			current_user_id = request.user.id
			user_profile = Profile.objects.get(user_id=current_user_id)
			print user_profile
			serializer = ProfileSerializer(user_profile)
			return Response(serializer.data)

class Username(APIView):
	def get(self, request, format=None):
		print "djsadksadas"
		if request.user.is_authenticated():
			current_user = request.user
			data = {'logged_in': request.user.username}
			print "Username is " + request.user.username
			return Response(data)
