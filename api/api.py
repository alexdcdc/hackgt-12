# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db import get_session

app = FastAPI(title="FastAPI x Supabase (no auth/RLS)")

# Example schema that matches your use case:
# tables: students(id bigserial PK, full_name text, email text), classes(...)

@app.get("/students")
async def list_students(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT s.id, first_name, last_name, email, AVG(engaged_percentage), COUNT(*), string_agg(name, ',') FROM public.students as s LEFT JOIN public.class_attendances as a on s.id = student_id JOIN public.class_sessions as c ON session_id = c.id GROUP BY s.id"
    ))
    return [{"id": row["id"], "email": row["email"], "first_name": row["first_name"], "last_name": row["last_name"], "average_engagement": row["avg"], "total_sessions": row["count"], 'classes': row['string_agg'] } for row in res.mappings().all()]

@app.get("/class-sessions")
async def list_class_sessions(session: AsyncSession = Depends(get_session)):
    res = await session.execute(text(
        "SELECT * FROM public.class_sessions ORDER BY id"
    ))
    
    return [dict(row) for row in res.mappings().all()]