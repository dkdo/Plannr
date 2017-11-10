from rest_framework import serializers
from event.models import Event

class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True)
    start_date = serializers.DateTimeField(required=True)
    end_date = serializers.DateTimeField(required=True)
    user_id = serializers.IntegerField(required=False)

    def create(self, validated_data):
        """
        Create and return a new Event instance, given the validated data.
        """
        user_id = self.context['request'].user.id
        return Event.objects.create(user_id=user_id, **validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Event instance, given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.save()
        return instance
