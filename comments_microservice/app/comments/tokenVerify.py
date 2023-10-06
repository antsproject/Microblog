from jwt import decode, InvalidTokenError


def verify_token_user(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION')

    if not auth_header:
        return False
    _, token = auth_header.split()

    try:
        payload = decode(token, 'secret', algorithms=['HS256'])
    except InvalidTokenError:
        return False

    user_id = int(request.data.get('user_id'))

    if user_id == payload['id']:
        return True
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
    return False


def verify_token_user_param(request, user_id):
    auth_header = request.META.get('HTTP_AUTHORIZATION')

    if not auth_header:
        return False

    _, token = auth_header.split()

    try:
        payload = decode(token, 'secret', algorithms=['HS256'])
    except InvalidTokenError:
        return False

    if user_id == payload['id']:
        return True
    return False
