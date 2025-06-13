import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agent {
  id: number;
  name: string;
  type: string;
  api_key: string;
  model: string;
  temperature: number;
  max_output_token: number;
  mcp_servers: MCPServer[];
  created_dt: string;
  updated_dt: string;
}

export interface MCPServer {
  id: number;
  name: string;
  command: string;
  args: string[];
  envs: { [key: string]: string };
  agent_id: number;
  created_dt: string;
  updated_dt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Agent endpoints
  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.baseUrl}/agents`);
  }

  createAgent(agent: Omit<Agent, 'id' | 'created_dt' | 'updated_dt'>): Observable<Agent> {
    return this.http.post<Agent>(`${this.baseUrl}/agents`, agent);
  }

  updateAgent(id: number, agent: Omit<Agent, 'id' | 'created_dt' | 'updated_dt'>): Observable<Agent> {
    return this.http.put<Agent>(`${this.baseUrl}/agents/${id}`, agent);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/agents/${id}`);
  }

  // MCP Server endpoints
  getMcpServers(): Observable<MCPServer[]> {
    return this.http.get<MCPServer[]>(`${this.baseUrl}/mcp-servers`);
  }

  createMcpServer(server: Omit<MCPServer, 'id' | 'agent_id' | 'created_dt' | 'updated_dt'>): Observable<MCPServer> {
    return this.http.post<MCPServer>(`${this.baseUrl}/mcp-servers`, server);
  }

  updateMcpServer(id: number, server: Omit<MCPServer, 'id' | 'agent_id' | 'created_dt' | 'updated_dt'>): Observable<MCPServer> {
    return this.http.put<MCPServer>(`${this.baseUrl}/mcp-servers/${id}`, server);
  }

  deleteMcpServer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/mcp-servers/${id}`);
  }

  connectMcpServerToAgent(mcpServerId: number, agentId: number): Observable<MCPServer> {
    return this.http.post<MCPServer>(`${this.baseUrl}/mcp-servers/${mcpServerId}/connect/${agentId}`, {});
  }
} 