from rest_framework import serializers
from position.models import Position

class PositionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=100, required=True)
    salary = serializers.FloatField(required=False)
    department = serializers.CharField(max_length=100, default='Main', required=False)
    manager_id = serializers.IntegerField(required=False)
    organization_id = serializers.IntegerField(read_only=True)

    def create(self, validated_data):
        """
        Create and return a new Profile instance, given the validated data.
        """
        print "went into the position create method"
        uid = self.context['user_id']
        oid = self.context['org_id']
        position = Position.objects.create(
            organization_id=oid,
            manager_id=uid,
            **validated_data)
        return position

    def update(self, instance, validated_data):
        """
        Update and return an existing Profile instance, given the validated data.
        """
        print "went into the position update method"
        instance.title = validated_data.get('title', instance.title)
        instance.salary = validated_data.get('salary', 0)
        instance.department = validated_data.get('department', '')
        instance.manager = validated_data.get('manager', instance.manager)
        instance.save()
        return instance
