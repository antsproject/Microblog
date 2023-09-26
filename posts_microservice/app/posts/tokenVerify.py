from rest_framework_simplejwt.tokens import Token
import jwt


def verify_token_user(request):
    authorization_header = request.headers.get('Authorization', '').split()

    if len(authorization_header) != 2 or authorization_header[0].lower() != 'bearer':
        return False

    token = authorization_header[1]

    try:
        decoded_token = jwt.decode(jwt=Token(token),
                                   key='secret',
                                   algorithms=["HS256"])
        if request.get('user_id') != decoded_token.id:
            return False
        return True
    except Exception as e:
        print('JWT USER ERROR LOG -> ', e)
        return False


def verify_token_admin(request):
    authorization_header = request.headers.get('Authorization', '').split()

    if len(authorization_header) != 2 or authorization_header[0].lower() != 'bearer':
        return False

    token = authorization_header[1]

    try:
        decoded_token = jwt.decode(jwt=Token(token),
                                   key='secret',
                                   algorithms=["HS256"])
        if not decoded_token.get('is_staff'):
            return False
        return True
    except Exception as e:
        print('JWT ADMIN ERROR LOG -> ', e)
        return False
