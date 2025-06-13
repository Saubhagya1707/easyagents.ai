from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class MCPServerBase(BaseModel):
    name: str
    command: str
    args: List[str]
    envs: Dict[str, str]

class MCPServerCreate(MCPServerBase):
    pass

class MCPServer(MCPServerBase):
    id: int
    agent_id: int
    created_dt: datetime = Field(default_factory=datetime.utcnow)
    updated_dt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class AgentBase(BaseModel):
    name: str
    type: str
    api_key: str
    model: str
    temperature: float
    max_output_token: int

class AgentCreate(AgentBase):
    mcp_servers: List[MCPServerCreate] | None = None

class Agent(AgentBase):
    id: int
    mcp_servers: List[MCPServer]
    created_dt: datetime = Field(default_factory=datetime.utcnow)
    updated_dt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True 