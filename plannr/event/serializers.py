from rest_framework import serializers
from event.models import Event

class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True)
    date = serializers.DateField(required=True)

    def create(self, validated_data):
        """
        Create and return a new Event instance, given the validated data.
        """
        for x in validated_data:
            print x
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Event instance, given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance
