import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

COGNITO_POOL_ID = "us-east-1_GC1DkkbL5"
COGNITO_REGION = "us-east-1"
COGNITO_APP_CLIENT_ID = "4u2unde3sbc2dvtrtkmnl8aaui"
COGNITO_JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_POOL_ID}/.well-known/jwks.json"

# Cache JWKS keys to avoid multiple network requests
jwks = None

def fetch_jwks():
    global jwks
    if not jwks:
        try:
            response = requests.get(COGNITO_JWKS_URL)
            response.raise_for_status()
            jwks = response.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch Cognito JWKS: {str(e)}")
    return jwks

def verify_cognito_token(token: str) -> str:
    jwks_keys = fetch_jwks()
    
    try:
        headers = jwt.get_unverified_header(token)
        key = next((k for k in jwks_keys["keys"] if k["kid"] == headers["kid"]), None)
        if key is None:
            raise HTTPException(status_code=401, detail="Invalid token key")
        
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=COGNITO_APP_CLIENT_ID
        )
        return payload["sub"]  # Returns user ID
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# FastAPI Dependency Injection
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    return verify_cognito_token(credentials.credentials)
