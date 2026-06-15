import { Component, input, output } from '@angular/core';
import { WorkstationWithOrder } from '../models/models';

@Component({
  selector: 'app-allocation-panel',
  standalone: true,
  template: `
    <section id="allocations" class="bg-white rounded-xl border border-fb-border shadow-sm">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-fb-divider flex items-center gap-3">
        <div class="w-8 h-8 bg-fb-blue-light rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-fb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2
                 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold text-fb-text">Alokacje stanowisk</h2>
          <p class="text-xs text-fb-secondary">Linia ID: {{ selectedLineId() }}</p>
        </div>
        <span class="ml-auto text-xs font-medium bg-fb-blue-light text-fb-blue px-2 py-0.5 rounded-full">
          {{ allocatedWorkstations().length }}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5">
        <!-- Hint -->
        <div class="flex items-start gap-2.5 bg-fb-blue-light border border-fb-blue/20 rounded-lg px-4 py-3 mb-4">
          <svg class="w-4 h-4 text-fb-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm text-fb-blue">
            Kliknij <strong>+ Alokuj</strong> przy stanowisku na liście, aby przypisać je do tej linii.
          </p>
        </div>

        <!-- Ordered list -->
        <ul class="space-y-2">
          @for (w of allocatedWorkstations(); track w.id; let i = $index) {
            <li class="flex items-center gap-3 bg-fb-bg rounded-lg px-4 py-3">
              <span class="w-7 h-7 bg-fb-blue text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                {{ i + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <span class="font-semibold text-fb-text">{{ w.short_name }}</span>
                <span class="text-fb-secondary mx-1.5">–</span>
                <span class="text-fb-text text-sm">{{ w.name }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button
                  [disabled]="i === 0"
                  (click)="move.emit({ index: i, direction: 'up' })"
                  class="p-1.5 rounded-md hover:bg-fb-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Przesuń wyżej"
                >
                  <svg class="w-4 h-4 text-fb-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button
                  [disabled]="i === allocatedWorkstations().length - 1"
                  (click)="move.emit({ index: i, direction: 'down' })"
                  class="p-1.5 rounded-md hover:bg-fb-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Przesuń niżej"
                >
                  <svg class="w-4 h-4 text-fb-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <button
                  (click)="remove.emit(w.id)"
                  class="px-2.5 py-1 bg-red-50 hover:bg-fb-red text-fb-red hover:text-white text-xs font-medium rounded-md transition-colors ml-1"
                >
                  Usuń
                </button>
              </div>
            </li>
          } @empty {
            <li class="text-center py-10 text-fb-secondary text-sm">
              Brak przypisanych stanowisk do tej linii.
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class AllocationPanelComponent {
  readonly allocatedWorkstations = input.required<WorkstationWithOrder[]>();
  readonly selectedLineId = input.required<number>();
  readonly move = output<{ index: number; direction: 'up' | 'down' }>();
  readonly remove = output<number>();
}

