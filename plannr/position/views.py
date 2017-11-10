from django.shortcuts import render
from django.views.generic.base import TemplateView
from position.serializers import PositionSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from position.models import Position
from profil.models import Profile

class PositionList(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated():
            uid = request.user.id
            user_profile = Profile.objects.get(user_id=uid)
            org_id = user_profile.organization_id
            print ("user_id: ", uid)
            print ("org_id: ", org_id)
            positions = Position.objects.filter(organization_id=org_id)
            print positions
            serializer = PositionSerializer(positions, many=True)
            print serializer
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        user_id = request.user.id
        pos_id = request.POST['id']
        position_exists = exists_or_not(Position, id=pos_id)
        if position_exists:
            current_position = Position.objects.get(id=pos_id)
            serializer = PositionSerializer(current_position, data=request.data)
        else:
            user_profile = Profile.objects.get(user_id=user_id)
            org_id = user_profile.organization_id
            print ('org_id_add', org_id)
            serializer = PositionSerializer(data=request.data, context={'user_id': user_id, 'org_id': org_id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print serializer.errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def exists_or_not(classmodel, **kwargs):
	num_results = classmodel.objects.filter(**kwargs).count()
	if num_results > 0:
		return True
	else:
		return False
