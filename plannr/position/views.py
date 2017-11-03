from django.shortcuts import render
from django.views.generic.base import TemplateView
from position.serializers import PositionSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from position.models import Position

class PositionList(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated():
            user_id = request.user.id
            positions = Position.objects.filter(manager_id=user_id)
            serializer = PositionSerializer(positions, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = PositionSerializer(request.data)
        print ("position serializer: ", serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
