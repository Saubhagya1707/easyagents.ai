from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from . import crud, models, schemas
from .database import engine, get_db
from .routes.agents import agent_router
from .routes.mcp_servers import mcp_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dynamic Agent Creation API")

# Include routers
app.include_router(agent_router)
app.include_router(mcp_router)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)