# deps.py
import os
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
ANON_KEY = os.environ["SUPABASE_ANON_KEY"]
SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

def get_service_client() -> Client:
    # Use Service Role for privileged server operations (NEVER expose this key client-side)
    return create_client(SUPABASE_URL, SERVICE_ROLE)

def get_user_client(user_token: str) -> Client:
    # Create a client bound to the user's JWT so RLS applies
    client = create_client(SUPABASE_URL, ANON_KEY)
    # supabase-py v2 exposes postgrest and auth headers; we attach the bearer token
    client.postgrest.auth(user_token)
    return client
