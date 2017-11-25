from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from profil.views import is_manager
from rewards.models import Reward
from rewards.serializers import RewardSerializer

class RewardList(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated() and is_manager(request):
            uid = request.user.id
            user_profile = Profile.objects.get(user_id=uid)
            org_id = user_profile.organization_id
            rewards = Reward.objects.filter(organization_id=org_id).order_by('id')
            serializer = RewardSerializer(rewards, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        if request.user.is_authenticated() and is_manager(request):
            user_id = request.user.id
            user_profile = Profile.objects.get(user_id=user_id)
            org_id = user_profile.organization_id
            serializer = RewardSerializer(data=request.data, context={'org_id': org_id})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        if request.user.is_authenticated() and is_manager(request):
            user_id = request.user.id
            reward_id = request.POST['id']
            reward = Reward.objects.get(id=reward_id)
            reward_serializer = RewardSerializer(reward, data=request.data)
            if reward_serializer.is_valid():
                reward_serializer.save()
                return Response(reward_serializer.data)
        return Response(reward_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
