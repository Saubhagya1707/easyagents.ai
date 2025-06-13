from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    type = Column(String(50))
    api_key = Column(String(255))
    model = Column(String(100))
    temperature = Column(Float)
    max_output_token = Column(Integer)
    created_dt = Column(DateTime, default=datetime.utcnow)
    updated_dt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    mcp_servers = relationship("MCPServer", back_populates="agent", cascade="all, delete-orphan")

class MCPServer(Base):
    __tablename__ = "mcp_servers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    command = Column(String(100))
    args = Column(JSON)
    envs = Column(JSON)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    created_dt = Column(DateTime, default=datetime.utcnow)
    updated_dt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    agent = relationship("Agent", back_populates="mcp_servers") 