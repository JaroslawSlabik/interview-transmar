import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssemblyLine, Product } from '../models/models';

export type CreateAssemblyLineDto = Pick<AssemblyLine, 'product_id' | 'name' | 'is_active'>;

@Component({
  selector: 'app-assembly-line-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section id="assembly-lines" class="bg-white rounded-xl border border-fb-border shadow-sm mb-5">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-fb-divider flex items-center gap-3">
        <div class="w-8 h-8 bg-fb-blue-light rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-fb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1
                 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1
                 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-fb-text">Linie Montażowe</h2>
        <span class="ml-auto text-xs font-medium bg-fb-blue-light text-fb-blue px-2 py-0.5 rounded-full">
          {{ assemblyLines().length }}
        </span>
      </div>

      <div class="p-5">
        <!-- Filter bar -->
        <div class="flex items-center gap-3 bg-fb-bg rounded-lg px-4 py-2.5 mb-4">
          <svg class="w-4 h-4 text-fb-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1
                 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <label class="text-sm text-fb-secondary whitespace-nowrap">Filtruj produkt:</label>
          <select
            [ngModel]="selectedFilterProductId()"
            (ngModelChange)="filterChange.emit($event)"
            class="flex-1 bg-transparent text-sm text-fb-text focus:outline-none"
          >
            <option [ngValue]="null">— Wszystkie produkty —</option>
            @for (p of products(); track p.id) {
              <option [ngValue]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>

        <!-- Add form -->
        <div class="flex items-center gap-2 mb-5 flex-wrap">
          <select
            [(ngModel)]="newLine.product_id"
            class="px-3 py-2 border border-fb-border rounded-lg text-sm focus:outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20 transition-shadow"
          >
            <option [ngValue]="0">Wybierz produkt...</option>
            @for (p of products(); track p.id) {
              <option [ngValue]="p.id">{{ p.name }}</option>
            }
          </select>
          <input
            [(ngModel)]="newLine.name"
            placeholder="Nazwa linii"
            class="flex-1 min-w-40 px-3 py-2 border border-fb-border rounded-lg text-sm focus:outline-none focus:border-fb-blue focus:ring-2 focus:ring-fb-blue/20 transition-shadow placeholder:text-fb-secondary"
          />
          <label class="flex items-center gap-1.5 text-sm text-fb-text whitespace-nowrap cursor-pointer select-none">
            <input type="checkbox" [(ngModel)]="newLine.is_active" class="w-4 h-4 accent-fb-blue rounded" />
            Aktywna
          </label>
          <button
            (click)="onAdd()"
            class="px-4 py-2 bg-fb-blue hover:bg-fb-blue-hover text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            + Utwórz linię
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg border border-fb-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-fb-bg text-left border-b border-fb-border">
                <th class="px-4 py-3 text-xs font-semibold text-fb-secondary uppercase tracking-wider w-16">ID</th>
                <th class="px-4 py-3 text-xs font-semibold text-fb-secondary uppercase tracking-wider">Produkt</th>
                <th class="px-4 py-3 text-xs font-semibold text-fb-secondary uppercase tracking-wider">Nazwa linii</th>
                <th class="px-4 py-3 text-xs font-semibold text-fb-secondary uppercase tracking-wider w-28">Status</th>
                <th class="px-4 py-3 text-xs font-semibold text-fb-secondary uppercase tracking-wider w-44 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-fb-divider">
              @for (line of assemblyLines(); track line.id) {
                <tr class="transition-colors"
                    [class]="line.id === selectedLineId() ? 'bg-fb-blue-light' : 'hover:bg-fb-bg'">
                  <td class="px-4 py-3 text-fb-secondary font-mono text-xs">{{ line.id }}</td>
                  <td class="px-4 py-3 text-fb-secondary text-xs">{{ line.product_id }}</td>
                  <td class="px-4 py-3 font-medium text-fb-text">{{ line.name }}</td>
                  <td class="px-4 py-3">
                    @if (line.is_active) {
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-fb-green text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-fb-green"></span>Aktywna
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Nieaktywna
                      </span>
                    }
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        class="px-2.5 py-1 bg-fb-blue-light hover:bg-fb-blue text-fb-blue hover:text-white text-xs font-medium rounded-md transition-colors"
                        (click)="selectLine.emit(line.id)"
                      >
                        ⚙ Alokacje
                      </button>
                      <button
                        class="px-2.5 py-1 bg-red-50 hover:bg-fb-red text-fb-red hover:text-white text-xs font-medium rounded-md transition-colors"
                        (click)="deleteLine.emit(line.id)"
                      >
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-10 text-center text-fb-secondary text-sm">
                    Brak linii montażowych.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class AssemblyLineListComponent {
  readonly assemblyLines = input.required<AssemblyLine[]>();
  readonly products = input.required<Product[]>();
  readonly selectedLineId = input<number | null>(null);
  readonly selectedFilterProductId = input<number | null>(null);
  readonly addLine = output<CreateAssemblyLineDto>();
  readonly deleteLine = output<number>();
  readonly selectLine = output<number>();
  readonly filterChange = output<number | null>();

  protected newLine: CreateAssemblyLineDto = { product_id: 0, name: '', is_active: true };

  protected onAdd(): void {
    this.addLine.emit({ ...this.newLine });
    this.newLine = { product_id: 0, name: '', is_active: true };
  }
}

