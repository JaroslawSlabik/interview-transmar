import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';

const mockProducts = [
  { id: 1, name: 'Produkt A', created_at: '' },
  { id: 2, name: 'Produkt B', created_at: '' },
];

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProductListComponent] });
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', mockProducts);
    fixture.detectChanges();
  });

  it('powinien wyrenderować listę produktów', () => {
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Produkt A');
    expect(items[1].textContent).toContain('Produkt B');
  });

  it('powinien wyrenderować pustą listę gdy brak produktów', () => {
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Brak');
  });

  it('powinien emitować addProduct z nazwą po kliknięciu Dodaj', () => {
    let emitted: string | undefined;
    component.addProduct.subscribe((name: string) => (emitted = name));

    component['newProductName'] = 'Nowy';
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe('Nowy');
  });

  it('powinien wyczyścić pole po dodaniu produktu', () => {
    component['newProductName'] = 'Produkt C';
    fixture.nativeElement.querySelector('button').click();
    expect(component['newProductName']).toBe('');
  });
});
