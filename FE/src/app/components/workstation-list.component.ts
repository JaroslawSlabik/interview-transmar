import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Workstation } from '../models/models';

export type CreateWorkstationDto = Pick<Workstation, 'short_name' | 'name' | 'pc_name'>;

@Component({
  selector: 'app-workstation-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section id="workstations" class="bg-white rounded-xl border border-fb-border shadow-sm flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-fb-divider flex items-center gap-3">
        <div class="w-8 h-8 bg-fb-blue-light rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-fb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-fb-text">Stanowiska</h2>
        <span class="ml-auto text-xs font-medium bg-fb-blue-light text-fb-blue px-2 py-0.5 rounded-full">
          {{ workstations().length }}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5 flex-1 flex flex-col">
        <!-- Add form -->
        <div class="grid grid-cols-3 gap-2 mb-2">
          <input [(ngModel)]="newWorkstation.short_name" placeholder="Skrót (WS-...)"
            class="px-3 py-2 border border-fb-border rounded-lg text-sm focus:outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20 transition-shadow placeholder:text-fb-secondary" />
          <input [(ngModel)]="newWorkstation.name" placeholder="Nazwa pełna"
            class="px-3 py-2 border border-fb-border rounded-lg text-sm focus:outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20 transition-shadow placeholder:text-fb-secondary" />
          <input [(ngModel)]="newWorkstation.pc_name" placeholder="Nazwa PC"
            class="px-3 py-2 border border-fb-border rounded-lg text-sm focus:outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20 transition-shadow placeholder:text-fb-secondary" />
        </div>
        <button
          (click)="onAdd()"
          class="mb-4 self-start px-4 py-2 bg-fb-blue hover:bg-fb-blue-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Dodaj Stanowisko
        </button>

        <!-- List -->
        <ul class="space-y-1.5">
          @for (w of workstations(); track w.id) {
            <li class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-fb-bg text-sm">
              <div class="w-8 h-8 bg-fb-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-fb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span class="font-semibold text-fb-text">{{ w.short_name }}</span>
                <span class="text-fb-secondary mx-1.5">–</span>
                <span class="text-fb-text">{{ w.name }}</span>
                <span class="text-fb-secondary text-xs ml-1">({{ w.pc_name }})</span>
              </div>
              @if (selectedLineId()) {
                <button
                  class="ml-auto px-2.5 py-1 bg-fb-green hover:bg-fb-green-hover text-white text-xs font-medium rounded-md transition-colors flex-shrink-0"
                  (click)="allocate.emit(w)"
                >
                  + Alokuj
                </button>
              }
            </li>
          } @empty {
            <li class="text-center py-8 text-fb-secondary text-sm">Brak stanowisk.</li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class WorkstationListComponent {
  readonly workstations = input.required<Workstation[]>();
  readonly selectedLineId = input<number | null>(null);
  readonly addWorkstation = output<CreateWorkstationDto>();
  readonly allocate = output<Workstation>();

  protected newWorkstation: CreateWorkstationDto = { short_name: '', name: '', pc_name: '' };

  protected onAdd(): void {
    this.addWorkstation.emit({ ...this.newWorkstation });
    this.newWorkstation = { short_name: '', name: '', pc_name: '' };
  }
}

