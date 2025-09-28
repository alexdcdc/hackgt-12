# db.py
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

load_dotenv()
print(os.environ)
DB_URL = os.environ["DATABASE_URL"]

# If you're using the pooled port 6543, prefer NullPool (PgBouncer handles pooling).
# If you're on 5432, comment out poolclass=NullPool and set pool_size / max_overflow instead.
engine = create_async_engine(
    DB_URL,
    pool_pre_ping=True,
    poolclass=NullPool            # use PgBouncer's pool; for 5432 remove this line
    # For 5432 instead:
    # pool_size=5, max_overflow=10
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
