from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import engine, get_db, init_db
from .routes.agents import agent_router
from .routes.mcp_servers import mcp_router

# Initialize database and create tables
init_db()

app = FastAPI(title="Dynamic Agent Creation API")

# Configure CORS
origins = [
    "http://localhost:4200",  # Angular default development server
    "http://localhost:3000",  # Alternative development server
    "http://127.0.0.1:4200",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(agent_router)
app.include_router(mcp_router)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)