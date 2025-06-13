from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db

mcp_router = APIRouter(prefix="/mcp-servers")

# Standalone MCP Server routes
@mcp_router.post("/", response_model=schemas.MCPServer)
def create_mcp_server(
    mcp_server: schemas.MCPServerCreate,
    db: Session = Depends(get_db)
):
    return crud.create_standalone_mcp_server(db=db, mcp_server=mcp_server)

@mcp_router.get("/", response_model=List[schemas.MCPServer])
def read_mcp_servers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_standalone_mcp_servers(db, skip=skip, limit=limit)

@mcp_router.get("/{mcp_server_id}", response_model=schemas.MCPServer)
def read_mcp_server(
    mcp_server_id: int,
    db: Session = Depends(get_db)
):
    mcp_server = crud.get_mcp_server(db, mcp_server_id)
    if not mcp_server:
        raise HTTPException(status_code=404, detail="MCP server not found")
    return mcp_server

@mcp_router.put("/{mcp_server_id}", response_model=schemas.MCPServer)
def update_mcp_server(
    mcp_server_id: int,
    mcp_server: schemas.MCPServerCreate,
    db: Session = Depends(get_db)
):
    db_mcp_server = crud.update_mcp_server(db, mcp_server_id=mcp_server_id, mcp_server=mcp_server)
    if not db_mcp_server:
        raise HTTPException(status_code=404, detail="MCP server not found")
    return db_mcp_server

@mcp_router.delete("/{mcp_server_id}")
def delete_mcp_server(
    mcp_server_id: int,
    db: Session = Depends(get_db)
):
    if crud.delete_mcp_server(db, mcp_server_id):
        return {"message": "MCP server deleted successfully"}
    raise HTTPException(status_code=404, detail="MCP server not found")

# Connection endpoint
@mcp_router.post("/{mcp_server_id}/connect/{agent_id}", response_model=schemas.MCPServer)
def connect_to_agent(
    mcp_server_id: int,
    agent_id: int,
    db: Session = Depends(get_db)
):
    # Verify both agent and MCP server exist
    agent = crud.get_agent(db, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    mcp_server = crud.get_mcp_server(db, mcp_server_id)
    if not mcp_server:
        raise HTTPException(status_code=404, detail="MCP server not found")
    
    # Check if MCP server is already connected to an agent
    if mcp_server.agent_id is not None:
        raise HTTPException(status_code=400, detail="MCP server is already connected to an agent")
    
    return crud.connect_mcp_server_to_agent(db, mcp_server_id=mcp_server_id, agent_id=agent_id) 