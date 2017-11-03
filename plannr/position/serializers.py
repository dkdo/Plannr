from rest_framework import serializers
from position.models import Position

class PositionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100, required=True)
    salary = serializers.FloatField()
    department = serializers.CharField(max_length=100, default='Main')
    manager = serializers.IntegerField()

    def create(self, validated_data):
        """
        Create and return a new Profile instance, given the validated data.
        """
        print "went into the position create method"
        position = Position.objects.create(**validated_data)
        return position

    def update(self, instance, validated_data):
        """
        Update and return an existing Profile instance, given the validated data.
        """
        print "went into the position update method"
        instance.title = validated_data.get('title', '')
        instance.salary = validated_data.get('salary', '')
        instance.department = validated_data.get('department', '')
        instance.manager = validated_data.get('manager', '')
        instance.save()
        return instance
