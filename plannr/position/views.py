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
            print user_id
            positions = Position.objects.filter(manager_id=user_id)
            print positions
            serializer = PositionSerializer(positions, many=True)
            print serializer
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        user_id = request.user.id
        serializer = PositionSerializer(data=request.data, context={'user_id': user_id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print serializer.errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
