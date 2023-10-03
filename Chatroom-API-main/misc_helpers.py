import jwt
from datetime import datetime, timedelta
def string_to_bool(s):
    if s.lower() == 'true':
        return True
    elif s.lower() == 'false':
        return False
    else:
        raise ValueError("String must be 'True' or 'False'")

def generate_token(user_id):
    token_payload={
                "user_id":user_id,
                "exp":datetime.utcnow()+timedelta(hours=1)
            }
    token=jwt.encode(token_payload,'my_secret_key(CHANGE THIS WHEN GOING TO PRODUCTION)',algorithm='HS256')
    return token
def verify_token(token,SECRET_KEY='my_secret_key(CHANGE THIS WHEN GOING TO PRODUCTION)'):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return True,decoded
    except jwt.ExpiredSignatureError:
        return False,{'message': 'Token has expired'}
    except jwt.InvalidTokenError:
        return False,{'message': 'Invalid token'}