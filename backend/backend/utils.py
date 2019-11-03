from accounts.serializers import UserSerializer
import logging

# token-auth for log in
def new_jwt_response_handler(token, user=None, request=None):
    logger = logging.getLogger(__name__)
    logger.debug(request);
    return {
        'token': token,
        'user': UserSerializer(user).data
    }
