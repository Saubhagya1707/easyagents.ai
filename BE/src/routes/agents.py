from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db

agent_router = APIRouter(prefix="/agents")

@agent_router.post("/", response_model=schemas.Agent)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    db_agent = crud.get_agent_by_name(db, name=agent.name)
    if db_agent:
        raise HTTPException(status_code=400, detail="Agent name already exists")
    return crud.create_agent(db=db, agent=agent)

@agent_router.get("/", response_model=List[schemas.Agent])
def read_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    agents = crud.get_agents(db, skip=skip, limit=limit)
    return agents

@agent_router.get("/{agent_id}", response_model=schemas.Agent)
def read_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = crud.get_agent(db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@agent_router.put("/{agent_id}", response_model=schemas.Agent)
def update_agent(agent_id: int, agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    db_agent = crud.update_agent(db, agent_id=agent_id, agent=agent)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@agent_router.delete("/{agent_id}")
def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    success = crud.delete_agent(db, agent_id=agent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}
