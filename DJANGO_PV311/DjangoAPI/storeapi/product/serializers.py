from rest_framework import serializers
from .models import Category, User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'created_at', 'updated_at', 'image']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    phone = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'photo', 'phone')

    def create(self, validated_data):
        photo = validated_data.pop('photo', None)
        phone = validated_data.pop('phone')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            phone=phone
        )
        if photo:
            user.photo = photo
            user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(use_url=True, required=False, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'photo', 'phone')

    def update(self, instance, validated_data):
        photo = validated_data.pop('photo', None)
        if photo:
            instance.photo = photo
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
