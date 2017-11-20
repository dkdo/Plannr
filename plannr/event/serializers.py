from rest_framework import serializers
from event.models import Event


class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True)
    start_date = serializers.DateTimeField(required=True)
    end_date = serializers.DateTimeField(required=True)
    manager_id = serializers.IntegerField(required=False)
    employee_id = serializers.IntegerField(required=False)

    def create(self, validated_data):
        """
        Create and return a new Event instance, given the validated data.
        """
        manager_id = self.context['request'].user.id
        return Event.objects.create(manager_id=manager_id, **validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Event instance, given the validated data.
        """
        instance.title = validated_data.get('title', instance.title)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.employee_id = validated_data.get('employee_id', instance.employee_id)
        instance.save()
        return instance
