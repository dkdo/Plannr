from rest_framework import serializers
from stats.models import Stat

class StatSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(read_only=True)
    hours = serializers.FloatField(required=False)
    taken_shifts = serializers.IntegerField(required=False)
    given_shifts = serializers.IntegerField(required=False)
    total = serializers.FloatField(required=False)

    def create(self, validated_data):
        """
        Create and return a new Stat instance, given the validated data.
        """
        user = self.context['user']
        user_id = user.id
        stat = Stat.objects.create(
            user_id=user_id,
            **validated_data)
        return stat

    def update(self, instance, validated_data):
        """
        Update and return an existing Stat instance, given the validated data.
        """
        situation = self.context['situation']
        instance.hours = validated_data.get('hours', instance.hours)
        instance.total = validated_data.get('total', instance.total)
        instance.taken_shifts = validated_data.get('taken_shifts', instance.taken_shifts)
        instance.given_shifts = validated_data.get('given_shifts', instance.given_shifts)
        if situation == 'giver':
            instance.given_shifts = instance.given_shifts + 1
        if situation == 'taker':
            instance.taken_shifts = instance.taken_shifts + 1
        instance.save()
        return instance
