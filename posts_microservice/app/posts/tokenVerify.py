from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from jwt import decode, InvalidTokenError


def verify_token_user(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION')

    if not auth_header:
        return False

    # Тут достаем с учетом стандартной схемы "Bearer <токен>"
    _, token = auth_header.split()

    try:
        payload = decode(token, 'secret', algorithms=['HS256'])
    except InvalidTokenError:
        return False

    # user_id из тела запроса
    user_id = int(request.data.get('user_id'))

    # Сравниваем с тем что в payload
    if user_id == payload['id']:
        return True
    else:
        return False


def verify_token_admin(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION')

    if not auth_header:
        return False

    _, token = auth_header.split()

    try:
        payload = decode(token, 'secret', algorithms=['HS256'])
    except InvalidTokenError:
        return False

    if payload['is_staff']:
        return True
    else:
        return False

# def verify_token_user(request):
#     authorization_header = request.headers.get('Authorization', '').split()
#
#     # if len(authorization_header) != 2 or authorization_header[0].lower() != 'bearer':
#     #     return False
#
#     token = authorization_header[1]
#
#     try:
#         decoded_token = jwt.decode(jwt=Token(token),
#                                    key='secret',
#                                    algorithms=["HS256"])
#         if request.get('user_id') != decoded_token.id:
#             return False
#         return True
#     except Exception as e:
#         print('JWT USER ERROR LOG -> ', e)
#         return False
#
#

# def verify_token_admin(request):
#     authorization_header = request.headers.get('Authorization', '').split()
#
#     if len(authorization_header) != 2 or authorization_header[0].lower() != 'bearer':
#         return False
#
#     token = authorization_header[1]
#
#     try:
#         decoded_token = jwt.decode(jwt=Token(token),
#                                    key='secret',
#                                    algorithms=["HS256"])
#         if not decoded_token.get('is_staff'):
#             return False
#         return True
#     except Exception as e:
#         print('JWT ADMIN ERROR LOG -> ', e)
#         return False
