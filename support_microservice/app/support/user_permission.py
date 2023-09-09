import jwt


# Example function for check user
def verify_token(request_data):
    token = request_data.get('jwt-token')

    try:
        decoded_token = jwt.decode(jwt=token['access'], key='secret', algorithms=["HS256"])
        user = decoded_token.get('username', None)
        is_superuser = token.get('is_superuser')
        desired_username = request_data.get('username')
        if desired_username:
            return (True, is_superuser)
        else:
            return (False, is_superuser)

    except Exception as e:
        print(f'JWT token is not valid', e)
