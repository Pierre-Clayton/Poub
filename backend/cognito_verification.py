# mvp/backend/cognito_verification.py

import jwt
import requests
from fastapi import HTTPException

# Remplacez ces valeurs par vos paramètres Cognito
COGNITO_POOL_ID = "us-east-1_GC1DkkbL5"
COGNITO_REGION = "us-east-1"  # ex: "eu-west-1"
COGNITO_APP_CLIENT_ID = "4u2unde3sbc2dvtrtkmnl8aaui"

# URL pour récupérer les clés JWKS de Cognito
COGNITO_JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_POOL_ID}/.well-known/jwks.json"
jwks = requests.get(COGNITO_JWKS_URL).json()

def verify_cognito_token(token: str) -> str:
    try:
        headers = jwt.get_unverified_header(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")
    
    kid = headers.get("kid")
    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    if key is None:
        raise HTTPException(status_code=401, detail="Invalid token key")
    
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
    try:
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=COGNITO_APP_CLIENT_ID
        )
        return payload["sub"]  # Identifiant utilisateur
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")
