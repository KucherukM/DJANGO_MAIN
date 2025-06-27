from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse

class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        return None

class MediaCorsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.method == 'OPTIONS' and request.path.startswith('/media/'):
            response = HttpResponse()
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range'
            return response
        return None

    def process_response(self, request, response):
        if request.path.startswith('/media/'):
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range'
            response['Cache-Control'] = 'public, max-age=31536000'
        return response 