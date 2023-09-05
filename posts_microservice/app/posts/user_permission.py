from rest_framework_simplejwt.tokens import Token


def verify_token(request):
    token = request.data['jwt_token']

    try:
        decoded_token = Token(token)
        user = decoded_token.payload.get('username')
        desired_username = request.data.get('username')

        if user == desired_username:
            return True
        else:
            return False

    except Exception:
        print(f'JWT token is not valid')
