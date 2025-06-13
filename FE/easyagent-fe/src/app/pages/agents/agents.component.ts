import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Agent } from '../../services/api.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>

    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-bold m-0">Agents</h2>
        <p-button 
          label="Create Agent" 
          icon="pi pi-plus" 
          (onClick)="showCreateDialog()">
        </p-button>
      </div>

      <p-table 
        [value]="agents" 
        [paginator]="true" 
        [rows]="10" 
        [loading]="loading"
        styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Model</th>
            <th>Temperature</th>
            <th>Max Tokens</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-agent>
          <tr>
            <td>{{agent.name}}</td>
            <td>{{agent.type}}</td>
            <td>{{agent.model}}</td>
            <td>{{agent.temperature}}</td>
            <td>{{agent.max_output_token}}</td>
            <td>{{agent.created_dt | date}}</td>
            <td>
              <div class="flex gap-2">
                <p-button 
                  icon="pi pi-pencil" 
                  class="p-button-sm p-button-text"
                  (onClick)="editAgent(agent)">
                </p-button>
                <p-button 
                  icon="pi pi-trash" 
                  class="p-button-sm p-button-text p-button-danger"
                  (onClick)="confirmDelete(agent)">
                </p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center p-4">
              <div class="flex flex-column align-items-center gap-2">
                <i class="pi pi-robot text-400" style="font-size: 3rem"></i>
                <span class="text-500">No agents found</span>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Create/Edit Agent Dialog -->
    <p-dialog 
      [header]="isEditMode ? 'Edit Agent' : 'Create New Agent'" 
      [(visible)]="dialogVisible" 
      [style]="{width: '600px'}"
      [modal]="true">
      <form [formGroup]="agentForm" (ngSubmit)="onSubmit()" class="p-fluid">
        <div class="grid">
          <div class="col-12 field">
            <label for="name">Name</label>
            <input id="name" type="text" pInputText formControlName="name" class="w-full">
          </div>

          <div class="col-12 field">
            <label for="type">Type</label>
            <input id="type" type="text" pInputText formControlName="type" class="w-full">
          </div>

          <div class="col-12 field">
            <label for="api_key">API Key</label>
            <input id="api_key" type="password" pInputText formControlName="api_key" class="w-full">
          </div>

          <div class="col-12 field">
            <label for="model">Model</label>
            <input id="model" type="text" pInputText formControlName="model" class="w-full">
          </div>

          <div class="col-6 field">
            <label for="temperature">Temperature</label>
            <p-inputNumber id="temperature" formControlName="temperature" 
              [min]="0" [max]="1" [step]="0.1" class="w-full">
            </p-inputNumber>
          </div>

          <div class="col-6 field">
            <label for="max_output_token">Max Output Tokens</label>
            <p-inputNumber id="max_output_token" formControlName="max_output_token" 
              [min]="1" class="w-full">
            </p-inputNumber>
          </div>
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            class="p-button-text" 
            (onClick)="closeDialog()">
          </p-button>
          <p-button 
            label="Save" 
            icon="pi pi-check" 
            type="submit" 
            [disabled]="!agentForm.valid">
          </p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: []
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];
  dialogVisible = false;
  isEditMode = false;
  loading = false;
  agentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      api_key: ['', [Validators.required]],
      model: ['', [Validators.required]],
      temperature: [0.7, [Validators.required, Validators.min(0), Validators.max(1)]],
      max_output_token: [1000, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
    this.loading = true;
    this.apiService.getAgents().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load agents'
        });
        this.loading = false;
      }
    });
  }

  showCreateDialog() {
    this.isEditMode = false;
    this.agentForm.reset({
      temperature: 0.7,
      max_output_token: 1000
    });
    this.dialogVisible = true;
  }

  editAgent(agent: Agent) {
    this.isEditMode = true;
    this.agentForm.patchValue({
      name: agent.name,
      type: agent.type,
      api_key: agent.api_key,
      model: agent.model,
      temperature: agent.temperature,
      max_output_token: agent.max_output_token
    });
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
    this.agentForm.reset();
  }

  onSubmit() {
    if (this.agentForm.valid) {
      const agentData = this.agentForm.value;
      
      if (this.isEditMode) {
        // TODO: Implement edit functionality
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Edit functionality coming soon'
        });
      } else {
        this.apiService.createAgent(agentData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Agent created successfully'
            });
            this.closeDialog();
            this.loadAgents();
          },
          error: (error) => {
            console.error('Error creating agent:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create agent'
            });
          }
        });
      }
    }
  }

  confirmDelete(agent: Agent) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${agent.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAgent(agent.id);
      }
    });
  }

  deleteAgent(id: number) {
    this.apiService.deleteAgent(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Agent deleted successfully'
        });
        this.loadAgents();
      },
      error: (error) => {
        console.error('Error deleting agent:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete agent'
        });
      }
    });
  }
} 