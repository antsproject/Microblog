from django.http import HttpResponseRedirect


# class AddTrailingSlashMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#
#     def __call__(self, request):
#         if request.method in ["PATCH", "PUT", "GET"] and not request.path.endswith('/'):
#             return HttpResponseRedirect(request.path + '/')
#         return self.get_response(request)
