import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section id="products" class="bg-white rounded-xl border border-fb-border shadow-sm flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-fb-divider flex items-center gap-3">
        <div class="w-8 h-8 bg-fb-blue-light rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-fb-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 class="text-base font-semibold text-fb-text">Produkty</h2>
        <span class="ml-auto text-xs font-medium bg-fb-blue-light text-fb-blue px-2 py-0.5 rounded-full">
          {{ products().length }}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5 flex-1 flex flex-col">
        <!-- Add form -->
        <div class="flex gap-2 mb-4">
          <input
            [(ngModel)]="newProductName"
            placeholder="Nazwa rozdzielnicy (np. 8DAB)"
            class="flex-1 px-3 py-2 border border-fb-border rounded-lg text-sm text-fb-text
                   placeholder:text-fb-secondary focus:outline-none focus:border-fb-blue
                   focus:ring-2 focus:ring-fb-blue/20 transition-shadow"
          />
          <button
            (click)="onAdd()"
            class="px-4 py-2 bg-fb-blue hover:bg-fb-blue-hover text-white text-sm font-medium
                   rounded-lg transition-colors whitespace-nowrap"
          >
            + Dodaj
          </button>
        </div>

        <!-- List -->
        <ul class="space-y-1.5">
          @for (p of products(); track p.id) {
            <li class="flex items-center gap-3 px-3 py-2 rounded-lg bg-fb-bg text-sm">
              <span class="w-6 h-6 bg-fb-blue text-white text-xs font-bold rounded flex items-center justify-center flex-shrink-0">P</span>
              <span class="text-fb-secondary text-xs font-mono">#{{ p.id }}</span>
              <strong class="text-fb-text font-medium">{{ p.name }}</strong>
            </li>
          } @empty {
            <li class="text-center py-8 text-fb-secondary text-sm">Brak produktów. Dodaj pierwszy.</li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class ProductListComponent {
  readonly products = input.required<Product[]>();
  readonly addProduct = output<string>();

  protected newProductName = '';

  protected onAdd(): void {
    this.addProduct.emit(this.newProductName);
    this.newProductName = '';
  }
}

