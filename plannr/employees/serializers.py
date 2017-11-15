from rest_framework import serializers
from employees.models import Employees


class EmployeesSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField(required=True)
    manager_id = serializers.IntegerField(required=True)

    def create(self, validated_data):
        """
        Create and return a new Event instance, given the validated data.
        """
        manager_id = self.context['request'].user.id
        return Employees.objects.create(manager_id=manager_id, **validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Event instance, given the validated data.
        """
        manager = self.context['request'].user
        instance.manager_id = manager.get('id', instance.manager_id)
        instance.employee_id = validated_data.get('employee_id', instance.employee_id)
        instance.save()
        return instance
