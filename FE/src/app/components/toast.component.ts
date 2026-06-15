import { Component, inject } from '@angular/core';
import { Toast, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-lg border"
          [class]="wrapperClass(toast)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @if (toast.type === 'error') {
              <svg class="w-5 h-5 text-fb-red" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            }
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-fb-green" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
            @if (toast.type === 'info') {
              <svg class="w-5 h-5 text-fb-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            }
          </div>

          <!-- Message -->
          <p class="flex-1 text-sm text-fb-text font-medium leading-5 break-words">{{ toast.message }}</p>

          <!-- Close -->
          <button
            class="flex-shrink-0 p-1 rounded-md hover:bg-fb-hover transition-colors"
            (click)="toastService.remove(toast.id)"
          >
            <svg class="w-4 h-4 text-fb-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected wrapperClass(toast: Toast): string {
    const anim = toast.exiting ? 'animate-slide-out' : 'animate-slide-in';
    switch (toast.type) {
      case 'error':   return `${anim} border-fb-red/40`;
      case 'success': return `${anim} border-fb-green/40`;
      case 'info':    return `${anim} border-fb-blue/40`;
    }
  }
}
