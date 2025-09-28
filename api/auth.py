# auth.py
import os, json, time
import httpx
from jose import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer = HTTPBearer(auto_error=False)

class JWKSCache:
    def __init__(self, url: str):
        self.url = url
        self.keys = None
        self.fetched_at = 0

    async def get_keys(self):
        if not self.keys or (time.time() - self.fetched_at) > 3600:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(self.url)
                r.raise_for_status()
                self.keys = r.json()["keys"]
                self.fetched_at = time.time()
        return self.keys

jwks = JWKSCache(os.environ["SUPABASE_JWKS_URL"])
SUPABASE_URL = os.environ["SUPABASE_URL"]
ISS = f"{SUPABASE_URL}/auth/v1"

async def get_current_user_token(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    token = creds.credentials
    # Verify signature using JWKS
    keys = await jwks.get_keys()
    header = jwt.get_unverified_header(token)
    k = next((k for k in keys if k["kid"] == header.get("kid")), None)
    if not k:
        raise HTTPException(status_code=401, detail="Invalid token header")

    try:
        claims = jwt.decode(
            token,
            jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(k)),
            options={"verify_aud": False},  # Supabase often doesn't set aud for custom backends
            algorithms=[header["alg"]],
            issuer=ISS,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"token": token, "claims": claims}
