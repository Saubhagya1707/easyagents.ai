import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule, ButtonModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <div class="w-3 border-right-1 surface-border">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">EasyAgents</h2>
          <div class="flex flex-column gap-2">
            <a 
              routerLink="agents" 
              routerLinkActive="bg-primary-50"
              class="p-3 border-round text-900 hover:surface-100 transition-colors transition-duration-150 cursor-pointer">
              <i class="pi pi-users mr-2"></i>
              Agents
            </a>
            <a 
              routerLink="mcp-servers" 
              routerLinkActive="bg-primary-50"
              class="p-3 border-round text-900 hover:surface-100 transition-colors transition-duration-150 cursor-pointer">
              <i class="pi pi-server mr-2"></i>
              MCP Servers
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <div class="p-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Agents',
      icon: 'pi pi-users',
      routerLink: 'agents'
    },
    {
      label: 'MCP Servers',
      icon: 'pi pi-server',
      routerLink: 'mcp-servers'
    }
  ];
} 