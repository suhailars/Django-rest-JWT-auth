from refreshtoken.models import RefreshToken

def jwt_response_payload_handler(token, user=None, request=None):
    payload = {
        'token': token,
    }

    app = 'account'
    try:
        refresh_token = user.refresh_tokens.get(app=app).key
    except RefreshToken.DoesNotExist:
        refresh_token =  RefreshToken.objects.create(app=app, user=user)
        refresh_token = refresh_token.key

    payload['refresh_token'] = refresh_token
    return payload
