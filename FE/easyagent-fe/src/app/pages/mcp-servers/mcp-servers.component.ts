import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mcp-servers',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>

    <div class="card surface-card shadow-2 border-round">
      <div class="flex justify-content-between align-items-center mb-4 p-4 border-bottom-1 surface-border">
        <div>
          <h2 class="text-2xl font-bold m-0 text-900">MCP Servers</h2>
          <p class="text-500 mt-2">Manage your MCP servers and their configurations</p>
        </div>
        <p-button 
          label="Create MCP Server" 
          icon="pi pi-plus" 
          (onClick)="showCreateDialog()"
          class="p-button-primary">
        </p-button>
      </div>

      <div class="p-4">
        <p-table 
          #dt
          [value]="mcpServers" 
          [paginator]="true" 
          [rows]="10" 
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} servers"
          [rowsPerPageOptions]="[10,25,50]"
          styleClass="p-datatable-sm p-datatable-gridlines"
          [globalFilterFields]="['name','command','agent_id']"
          [loading]="loading"
          responsiveLayout="scroll">
          <ng-template pTemplate="caption">
            <div class="flex justify-content-between align-items-center">
              <div class="flex align-items-center gap-2">
                <span class="p-input-icon-left">
                  <i class="pi pi-search"></i>
                  <input 
                    #searchInput
                    pInputText 
                    type="text" 
                    (input)="dt.filterGlobal(searchInput.value, 'contains')" 
                    placeholder="Search servers..." 
                    class="p-inputtext-sm w-20rem" />
                </span>
                <p-button 
                  icon="pi pi-refresh" 
                  class="p-button-text p-button-rounded"
                  pTooltip="Refresh"
                  tooltipPosition="top"
                  (onClick)="loadMcpServers()">
                </p-button>
              </div>
            </div>
          </ng-template>
          <ng-template pTemplate="header">
            <tr>
              <th class="text-900">Name</th>
              <th class="text-900">Command</th>
              <th class="text-900">Arguments</th>
              <th class="text-900">Environment Variables</th>
              <th class="text-900">Agent</th>
              <th class="text-900">Created</th>
              <th class="text-900" style="width: 8rem">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-server>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-server text-primary"></i>
                  <span class="font-medium">{{server.name}}</span>
                </div>
              </td>
              <td>
                <code class="bg-primary-50 text-primary-900 p-2 border-round">
                  {{server.command}}
                </code>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span *ngFor="let arg of server.args" 
                    class="p-tag p-tag-rounded bg-primary-100 text-primary-800">
                    {{arg}}
                  </span>
                </div>
              </td>
              <td>
                <div class="flex flex-column gap-1">
                  <div *ngFor="let env of server.envs | keyvalue" 
                    class="text-sm bg-surface-200 p-2 border-round">
                    <span class="font-medium">{{env.key}}</span>: {{env.value}}
                  </div>
                </div>
              </td>
              <td>
                <span class="p-tag p-tag-rounded bg-blue-100 text-blue-800">
                  {{server.agent_id}}
                </span>
              </td>
              <td>{{server.created_dt | date:'medium'}}</td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-pencil" 
                    class="p-button-sm p-button-text p-button-rounded"
                    pTooltip="Edit Server"
                    tooltipPosition="top">
                  </p-button>
                  <p-button 
                    icon="pi pi-trash" 
                    class="p-button-sm p-button-text p-button-rounded p-button-danger"
                    pTooltip="Delete Server"
                    tooltipPosition="top"
                    (onClick)="confirmDelete(server)">
                  </p-button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center p-4">
                <div class="flex flex-column align-items-center gap-2">
                  <i class="pi pi-server text-400" style="font-size: 3rem"></i>
                  <span class="text-500">No MCP servers found</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Create MCP Server Dialog -->
    <p-dialog 
      header="Create New MCP Server" 
      [(visible)]="createDialogVisible" 
      [style]="{width: '600px'}"
      [modal]="true"
      [draggable]="false"
      [resizable]="false">
      <form [formGroup]="mcpServerForm" (ngSubmit)="onSubmit()" class="p-fluid">
        <div class="grid">
          <div class="col-12 field">
            <label for="name" class="block text-900 font-medium mb-2">Name</label>
            <input id="name" type="text" pInputText formControlName="name" class="w-full" 
              placeholder="Enter server name">
          </div>

          <div class="col-12 field">
            <label for="command" class="block text-900 font-medium mb-2">Command</label>
            <input id="command" type="text" pInputText formControlName="command" class="w-full" 
              placeholder="Enter command to execute">
          </div>

          <div class="col-12 field">
            <label for="args" class="block text-900 font-medium mb-2">Arguments</label>
            <input id="args" type="text" pInputText formControlName="args" class="w-full" 
              placeholder="Enter comma-separated arguments">
            <small class="text-500">Separate multiple arguments with commas</small>
          </div>

          <div class="col-12 field">
            <label for="envs" class="block text-900 font-medium mb-2">Environment Variables</label>
            <textarea id="envs" pInputTextarea formControlName="envs" rows="3" class="w-full" 
              placeholder="Enter environment variables (key=value, one per line)"></textarea>
            <small class="text-500">Format: KEY=VALUE (one per line)</small>
          </div>
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            class="p-button-text" 
            (onClick)="createDialogVisible = false">
          </p-button>
          <p-button 
            label="Create" 
            icon="pi pi-check" 
            type="submit" 
            [disabled]="!mcpServerForm.valid"
            class="p-button-primary">
          </p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background: var(--surface-section);
        color: var(--text-color);
        font-weight: 600;
        padding: 1rem;
      }
      
      .p-datatable .p-datatable-tbody > tr > td {
        padding: 1rem;
      }

      .p-dialog .p-dialog-header {
        background: var(--surface-section);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }

      .p-dropdown, .p-inputtext, .p-inputtextarea {
        width: 100%;
      }

      code {
        font-family: monospace;
        font-size: 0.875rem;
      }

      .p-input-icon-left {
        width: 20rem;
      }

      .p-input-icon-left input {
        width: 100%;
      }
    }
  `]
})
export class McpServersComponent implements OnInit {
  mcpServers: any[] = [];
  createDialogVisible = false;
  mcpServerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.mcpServerForm = this.fb.group({
      name: ['', [Validators.required]],
      command: ['', [Validators.required]],
      args: ['', [Validators.required]],
      envs: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadMcpServers();
  }

  loadMcpServers() {
    this.loading = true;
    this.apiService.getMcpServers().subscribe({
      next: (servers) => {
        this.mcpServers = servers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading MCP servers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load MCP servers'
        });
        this.loading = false;
      }
    });
  }

  showCreateDialog() {
    this.createDialogVisible = true;
  }

  onSubmit() {
    if (this.mcpServerForm.valid) {
      const formValue = this.mcpServerForm.value;
      const serverData = {
        name: formValue.name,
        command: formValue.command,
        args: formValue.args.split(',').map((arg: string) => arg.trim()),
        envs: this.parseEnvs(formValue.envs)
      };

      this.apiService.createMcpServer(serverData).subscribe({
        next: () => {
          this.createDialogVisible = false;
          this.mcpServerForm.reset();
          this.loadMcpServers();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'MCP server created successfully'
          });
        },
        error: (error) => {
          console.error('Error creating MCP server:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create MCP server'
          });
        }
      });
    }
  }

  confirmDelete(server: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${server.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteServer(server.id);
      }
    });
  }

  deleteServer(id: number) {
    this.apiService.deleteMcpServer(id).subscribe({
      next: () => {
        this.loadMcpServers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'MCP server deleted successfully'
        });
      },
      error: (error) => {
        console.error('Error deleting MCP server:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete MCP server'
        });
      }
    });
  }

  private parseEnvs(envsString: string): { [key: string]: string } {
    const envs: { [key: string]: string } = {};
    envsString.split('\n').forEach(line => {
      const [key, value] = line.split('=').map(s => s.trim());
      if (key && value) {
        envs[key] = value;
      }
    });
    return envs;
  }
} 