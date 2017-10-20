from rest_framework import serializers
from profil.models import Profile

class ProfileSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=50, required=False)
    phone_num = serializers.CharField(max_length=12, required=False)
    birth_date = serializers.CharField(max_length=11, required=False)
    status = serializers.CharField(max_length=140, required=False)

    def create(self, validated_data):
        """
        Create and return a new Profile instance, given the validated data.
        """
        user_id = self.context['request'].user.id
        profile = Profile.objects.create(
            user_id=user_id,
            **validated_data)
        return profile

    def update(self, instance, validated_data):
        """
        Update and return an existing Profile instance, given the validated data.
        """
        instance.first_name = validated_data.get('first_name', instance.title)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_num = validated_data.get('phone_num', instance.phone_num)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance