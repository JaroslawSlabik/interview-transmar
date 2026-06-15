import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-fb-bg flex items-center justify-center p-4">
      <div class="w-full max-w-md">

        <!-- Logo + branding -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-fb-blue rounded-2xl mb-4 shadow-lg">
            <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158
                   a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0
                   00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782
                   0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-fb-text">Factory CRM</h1>
          <p class="text-fb-secondary text-sm mt-1">System Zarządzania Produkcją</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-md border border-fb-border p-8">
          <h2 class="text-xl font-semibold text-fb-text mb-6">Zaloguj się</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-fb-text mb-1.5">Login</label>
              <input
                [(ngModel)]="username"
                placeholder="np. jan_kowalski"
                class="w-full px-3 py-2.5 border border-fb-border rounded-lg text-fb-text text-sm
                       placeholder:text-fb-secondary focus:outline-none focus:border-fb-blue
                       focus:ring-2 focus:ring-fb-blue/20 transition-shadow"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-fb-text mb-1.5">Hasło</label>
              <input
                [(ngModel)]="password"
                type="password"
                placeholder="Hasło"
                class="w-full px-3 py-2.5 border border-fb-border rounded-lg text-fb-text text-sm
                       placeholder:text-fb-secondary focus:outline-none focus:border-fb-blue
                       focus:ring-2 focus:ring-fb-blue/20 transition-shadow"
              />
            </div>

            @if (loginError()) {
              <div class="flex items-center gap-2 bg-red-50 border border-red-200 text-fb-red text-sm rounded-lg px-3 py-2.5">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{ loginError() }}
              </div>
            }

            <button
              (click)="onLogin()"
              class="w-full bg-fb-blue hover:bg-fb-blue-hover text-white font-semibold py-2.5
                     rounded-lg transition-colors text-sm mt-2"
            >
              Zaloguj się
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class LoginFormComponent {
  readonly loginError = input('');
  readonly login = output<LoginCredentials>();

  protected username = '';
  protected password = '';

  protected onLogin(): void {
    this.login.emit({ username: this.username, password: this.password });
  }
}

