from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Category, User
from .serializers import CategorySerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import os
from urllib.parse import urlparse
from django.core.files.base import ContentFile

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def test_auth(request):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            User = get_user_model()
            user = User.objects.filter(id=user_id).first()
            if user:
                return Response({
                    'message': 'User is authenticated',
                    'user_id': user.id,
                    'username': user.username,
                })
            return Response({'message': 'User not found'}, status=404)
        except Exception as e:
            return Response({'message': 'Token decode error', 'error': str(e)}, status=400)
    return Response({'message': 'User is not authenticated'})

class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response({'error': 'Access token is required'}, status=400)
        
        try:
            google_user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(google_user_info_url, headers=headers)
            
            if response.status_code != 200:
                return Response({'error': 'Failed to get user info from Google'}, status=400)
            
            user_info = response.json()
            
            google_id = user_info.get('id')
            email = user_info.get('email')
            first_name = user_info.get('given_name', '')
            last_name = user_info.get('family_name', '')
            picture_url = user_info.get('picture')
            
            User = get_user_model()
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] if email else f'user_{google_id}',
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )
            
            if not created:
                user.first_name = first_name
                user.last_name = last_name
                user.save()
            
            if picture_url and (created or not user.photo):
                try:
                    img_response = requests.get(picture_url)
                    if img_response.status_code == 200:
                        parsed_url = urlparse(picture_url)
                        file_extension = os.path.splitext(parsed_url.path)[1] or '.jpg'
                        
                        filename = f'google_avatar_{user.id}{file_extension}'
                        
                        user.photo.save(filename, ContentFile(img_response.content), save=True)
                except Exception as e:
                    print(f"Error downloading profile picture: {e}")
            
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'photo': user.photo.url if user.photo else None,
                }
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500) 