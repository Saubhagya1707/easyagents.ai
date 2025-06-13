import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { McpServersComponent } from './pages/mcp-servers/mcp-servers.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'agents', component: AgentsComponent },
      { path: 'mcp-servers', component: McpServersComponent },
      { path: '', redirectTo: 'agents', pathMatch: 'full' }
    ]
  }
];
