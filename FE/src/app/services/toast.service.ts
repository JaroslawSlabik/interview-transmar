import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
  exiting: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  showError(message: string): void   { this.show(message, 'error'); }
  showSuccess(message: string): void { this.show(message, 'success'); }
  showInfo(message: string): void    { this.show(message, 'info'); }

  remove(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  private show(message: string, type: Toast['type']): void {
    const id = Date.now();
    this._toasts.update(list => [...list, { id, message, type, exiting: false }]);
    setTimeout(() => {
      this._toasts.update(list => list.map(t => t.id === id ? { ...t, exiting: true } : t));
    }, 3600);
    setTimeout(() => this.remove(id), 4000);
  }
}
