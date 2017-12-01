from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from profil.views import is_manager
from rewards.models import Reward
from rewards.serializers import RewardSerializer
from profil.models import Profile
from rewards.serializers import Employee_RewardsSerializer
from rewards.models import Employee_Rewards
from stats.models import Stat

class RewardList(APIView):
    def get_object(self, pk):
        try:
            return Reward.objects.get(pk=pk)
        except Reward.DoesNotExist:
            raise Http404

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

    def delete(self, request, format=None):
        pk = request.data.get('reward_id')
        reward = self.get_object(pk)
        print('reward')
        print(reward)
        reward.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AssignRewards(APIView):
    def patch(self, request, format=None):
        if request.user.is_authenticated() and not is_manager(request):
            user = request.user
            print '{} {}'.format('user_id: ', user.id)
            emp_stats = Stat.objects.get(user_id=user.id)
            emp_points = emp_stats.total
            current_rewards = Employee_Rewards.objects.filter(employee_id=user.id).values('reward_id')
            earned_rewards = Reward.objects.filter(required_points__lte=emp_points).exclude(id__in=current_rewards)
            print earned_rewards
            print '{} {}'.format('earned_rewards: ', earned_rewards);
            for reward in earned_rewards:
                r_data = {'reward_id': reward.id,
                          'needed_points': reward.required_points,
                          'emp_points': emp_points}
                serializer = Employee_RewardsSerializer(data=r_data, context={'user': user})
                if serializer.is_valid():
                    print('serializer is valid')
                    serializer.save()
                else:
                    print serializer.errors
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_OK)

    def get(self, request, format=None):
        if request.user.is_authenticated and not is_manager(request):
            user_id = request.user.id
            rewards_id = Employee_Rewards.objects.filter(employee_id=user_id).values('reward_id')
            if rewards_id:
                rewards = Reward.objects.filter(id__in=rewards_id).order_by('id')
                serializers = RewardSerializer(rewards, many=True)
                return Response(serializers.data)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_OK)
