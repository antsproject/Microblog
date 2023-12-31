import jwt


def verify_token(request_data):
    token = request_data.get('jwt_token')

    try:
        decoded_token = jwt.decode(jwt=token, key='secret', algorithms=["HS256"])
        user = decoded_token.get('username', None)
        desired_username = request_data.get('username')

        if user == desired_username:
            return True
        else:
            return False

    except Exception:
        print(f'JWT token is not valid')
