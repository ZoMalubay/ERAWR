from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    mobile_number = serializers.CharField(required=False, allow_blank=True)
    most_order_used = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'mobile_number', 'most_order_used')
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields
        if 'username' in user_data:
            user.username = user_data['username']
        if 'email' in user_data:
            user.email = user_data['email']
        user.save()
        
        # Update profile fields
        if 'mobile_number' in validated_data:
            instance.mobile_number = validated_data['mobile_number']
        if 'most_order_used' in validated_data:
            instance.most_order_used = validated_data['most_order_used']
        instance.save()
        
        return instance