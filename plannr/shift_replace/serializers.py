from rest_framework import serializers
from shift_replace.models import Shift


class ShiftSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField(required=True)
    interested_emp_id = serializers.IntegerField(required=False)
    searching = serializers.BooleanField(required=False)
    manager_approved = serializers.BooleanField(required=False)
    organization_id = serializers.IntegerField(required=True)
    created = serializers.DateTimeField(read_only=True)

    class Meta:
        ordering = ('created',)

    def create(self, validated_data):
        """
        Create and return a new Profile instance, given the validated data.
        """
        shift = Shift.objects.create(searching=True, manager_approved=False, **validated_data)
        return shift

    def update(self, instance, validated_data):
        """
        Update and return an existing Profile instance, given the validated data.
        """
        instance.interested_emp = validated_data.get('interested_emp', instance.interested_emp)
        instance.searching = validated_data.get('searching', instance.searching)
        instance.manager_approved = validated_data.get('manager_approved', instance.manager_approved)
        instance.save()
        return instance
