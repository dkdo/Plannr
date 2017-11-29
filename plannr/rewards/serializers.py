from rest_framework import serializers
from rewards.models import Reward
from rewards.models import Employee_Rewards

class RewardSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, required=True)
    required_points = serializers.IntegerField(required=True)
    organization_id = serializers.IntegerField(read_only=True)

    def create(self, validated_data):
        """
        Create and return a new Reward instance, given the validated data.
        """
        print "went into the reward create method"
        oid = self.context['org_id']
        return Reward.objects.create(organization_id=oid, **validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Reward instance, given the validated data.
        """
        print "went into the reward update method"
        instance.name = validated_data.get('name', instance.name)
        instance.required_points = validated_data.get('required_points', instance.required_points)
        instance.save()
        return instance

class Employee_RewardsSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    reward_id = serializers.IntegerField(required=False)
    employee_id = serializers.IntegerField(required=False)
    needed_points = serializers.IntegerField(required=False)
    emp_points = serializers.IntegerField(required=False)

    def create(self, validated_data):
        """
        Create and return a new employee-reward relation instance, given the validated data.
        """
        print "went into the employee-reward relation create method"
        user = self.context['user']
        user_id = user.id
        return Employee_Rewards.objects.create(employee_id=user_id, **validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing employee-reward relation instance, given the validated data.
        """
        print "went into the employee-reward relation update method"
        employee = self.context['request'].user
        instance.reward_id = validated_data.get('reward_id', instance.reward_id)
        instance.employee_id = employee.get('id', instance.employee_id)
        instace.needed_points = validated_data.get('needed_points', instance.needed_points)
        instance.emp_points = validated_data.get('emp_points', instance.emp_points)
        instance.save()
        return instance
