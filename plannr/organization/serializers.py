from rest_framework import serializers
from organization.models import Organization


class OrganizationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    organization_name = serializers.CharField(required=True)

    def create(self, validated_data):
        """
        Create and return a new Event instance, given the validated data.
        """
        print 'org create'
        return Organization.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing Event instance, given the validated data.
        """
        instance.organization_name = validated_data.get('organization_name', instance.organization_name)
        instance.save()
        return instance
