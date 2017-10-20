from django.shortcuts import render
from django.views.generic.base import TemplateView
from profil.serializers import ProfileSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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
