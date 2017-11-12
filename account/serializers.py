from rest_framework import serializers
from django.contrib.auth.models import User, Group

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 
            'first_name', 'last_name', 'password', 'confirm_password')

    def create(self, validated_data):
        confirm_password = validated_data.pop("confirm_password", "")
        first_name = validated_data.get("first_name", "")
        last_name = validated_data.get("last_name", "")
        validated_data["first_name"] = first_name
        validated_data["last_name"] = last_name
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username',
                                               instance.username)
        instance.first_name = validated_data.get('first_name',
                                                instance.first_name)
        instance.last_name = validated_data.get('last_name',
                                               instance.last_name)

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and password == confirm_password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, data):
        '''
        Ensure the passwords are the same
        '''
        if data['password']:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError(
                    "The passwords have to be the same"
                )
        return data


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name', 'user_set',)

    def create(self, validated_data):
        user_set = validated_data.pop("user_set")
        group = Group.objects.create(**validated_data)
        for i in user_set:
            group.user_set.add(i)
        return group

