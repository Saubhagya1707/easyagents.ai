import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="min-h-screen flex flex-column align-items-center justify-content-center bg-primary-50">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-primary mb-4">EasyAgents</h1>
        <p class="text-xl text-primary-700 mb-6">Your AI Agent Management Platform</p>
        <p-button 
          label="Try Now" 
          icon="pi pi-arrow-right" 
          iconPos="right"
          (onClick)="navigateToDashboard()"
          class="p-button-lg">
        </p-button>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
} 