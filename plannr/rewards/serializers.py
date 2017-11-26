from rest_framework import serializers
from rewards.models import Reward

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
