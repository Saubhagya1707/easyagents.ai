from sqlalchemy.orm import Session
from . import models, schemas

def get_agent(db: Session, agent_id: int):
    return db.query(models.Agent).filter(models.Agent.id == agent_id).first()

def get_agent_by_name(db: Session, name: str):
    return db.query(models.Agent).filter(models.Agent.name == name).first()

def get_agents(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Agent).offset(skip).limit(limit).all()

def create_agent(db: Session, agent: schemas.AgentCreate):
    db_agent = models.Agent(
        name=agent.name,
        type=agent.type,
        api_key=agent.api_key,
        model=agent.model,
        temperature=agent.temperature,
        max_output_token=agent.max_output_token
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    
    # Create MCP servers
    if agent.mcp_servers:
        for mcp_server in agent.mcp_servers:
            db_mcp_server = models.MCPServer(
                name=mcp_server.name,
                command=mcp_server.command,
                args=mcp_server.args,
                envs=mcp_server.envs,
                agent_id=db_agent.id
            )
            db.add(db_mcp_server)
    
    db.commit()
    db.refresh(db_agent)
    return db_agent

def update_agent(db: Session, agent_id: int, agent: schemas.AgentCreate):
    db_agent = get_agent(db, agent_id)
    if db_agent:
        for key, value in agent.dict(exclude={'mcp_servers'}).items():
            setattr(db_agent, key, value)
        
        # Delete existing MCP servers
        db.query(models.MCPServer).filter(models.MCPServer.agent_id == agent_id).delete()
        
        # Create new MCP servers
        for mcp_server in agent.mcp_servers:
            db_mcp_server = models.MCPServer(
                name=mcp_server.name,
                command=mcp_server.command,
                args=mcp_server.args,
                envs=mcp_server.envs,
                agent_id=agent_id
            )
            db.add(db_mcp_server)
        
        db.commit()
        db.refresh(db_agent)
    return db_agent

def delete_agent(db: Session, agent_id: int):
    db_agent = get_agent(db, agent_id)
    if db_agent:
        db.delete(db_agent)
        db.commit()
        return True
    return False

def get_mcp_server(db: Session, mcp_server_id: int):
    return db.query(models.MCPServer).filter(models.MCPServer.id == mcp_server_id).first()

def get_mcp_servers_by_agent(db: Session, agent_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.MCPServer).filter(models.MCPServer.agent_id == agent_id).offset(skip).limit(limit).all()

def create_mcp_server(db: Session, mcp_server: schemas.MCPServerCreate, agent_id: int):
    db_mcp_server = models.MCPServer(
        name=mcp_server.name,
        command=mcp_server.command,
        args=mcp_server.args,
        envs=mcp_server.envs,
        agent_id=agent_id
    )
    db.add(db_mcp_server)
    db.commit()
    db.refresh(db_mcp_server)
    return db_mcp_server

def update_mcp_server(db: Session, mcp_server_id: int, mcp_server: schemas.MCPServerCreate):
    db_mcp_server = get_mcp_server(db, mcp_server_id)
    if db_mcp_server:
        for key, value in mcp_server.dict().items():
            setattr(db_mcp_server, key, value)
        db.commit()
        db.refresh(db_mcp_server)
    return db_mcp_server

def delete_mcp_server(db: Session, mcp_server_id: int):
    db_mcp_server = get_mcp_server(db, mcp_server_id)
    if db_mcp_server:
        db.delete(db_mcp_server)
        db.commit()
        return True
    return False

def create_standalone_mcp_server(db: Session, mcp_server: schemas.MCPServerCreate):
    db_mcp_server = models.MCPServer(
        name=mcp_server.name,
        command=mcp_server.command,
        args=mcp_server.args,
        envs=mcp_server.envs,
        agent_id=None  # Initially not connected to any agent
    )
    db.add(db_mcp_server)
    db.commit()
    db.refresh(db_mcp_server)
    return db_mcp_server

def get_standalone_mcp_servers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MCPServer).filter(models.MCPServer.agent_id.is_(None)).offset(skip).limit(limit).all()

def connect_mcp_server_to_agent(db: Session, mcp_server_id: int, agent_id: int):
    db_mcp_server = get_mcp_server(db, mcp_server_id)
    if db_mcp_server:
        db_mcp_server.agent_id = agent_id
        db.commit()
        db.refresh(db_mcp_server)
    return db_mcp_server 