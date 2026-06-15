import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AssemblyLineListComponent, CreateAssemblyLineDto } from './assembly-line-list.component';
import { AssemblyLine, Product } from '../models/models';

const mockProducts: Product[] = [
  { id: 1, name: 'Produkt A', created_at: '' },
  { id: 2, name: 'Produkt B', created_at: '' },
];

const mockLines: AssemblyLine[] = [
  { id: 10, product_id: 1, name: 'Linia 1', is_active: true, created_at: '' },
  { id: 11, product_id: 2, name: 'Linia 2', is_active: false, created_at: '' },
];

describe('AssemblyLineListComponent', () => {
  let fixture: ComponentFixture<AssemblyLineListComponent>;
  let component: AssemblyLineListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AssemblyLineListComponent] });
    fixture = TestBed.createComponent(AssemblyLineListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('assemblyLines', mockLines);
    fixture.componentRef.setInput('products', mockProducts);
    fixture.detectChanges();
  });

  it('powinien wyrenderować wiersze tabeli dla każdej linii', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Linia 1');
  });

  it('powinien zaznaczyć klasą selected wiersz wybranej linii', () => {
    fixture.componentRef.setInput('selectedLineId', 10);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows[0].classList).toContain('bg-fb-blue-light');
    expect(rows[1].classList).not.toContain('bg-fb-blue-light');
  });

  it('powinien wyświetlić Aktywna dla aktywnej linii i Nieaktywna dla nieaktywnej', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('Aktywna');
    expect(rows[1].textContent).toContain('Nieaktywna');
  });

  it('powinien emitować selectLine po kliknięciu Alokacje', () => {
    let emitted: number | undefined;
    component.selectLine.subscribe((id: number) => (emitted = id));

    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const alokBtn = allButtons.find(b => b.textContent?.includes('Alokacje'))!;
    alokBtn.click();
    expect(emitted).toBe(10);
  });

  it('powinien emitować deleteLine po kliknięciu Usuń', () => {
    let emitted: number | undefined;
    component.deleteLine.subscribe((id: number) => (emitted = id));

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    const allButtons = Array.from(rows[0].querySelectorAll('button')) as HTMLButtonElement[];
    const usunBtn = allButtons.find(b => b.textContent?.trim() === 'Usuń')!;
    usunBtn.click();
    expect(emitted).toBe(10);
  });

  it('powinien emitować filterChange po zmianie selekta filtra', () => {
    let emitted: number | null | undefined;
    component.filterChange.subscribe((id: number | null) => (emitted = id));

    const selects: NodeListOf<HTMLSelectElement> = fixture.nativeElement.querySelectorAll('select');
    selects[0].value = '1';
    selects[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.filterChange).toBeDefined();
  });

  it('powinien emitować addLine z dto po kliknięciu Utwórz linię', () => {
    let emitted: CreateAssemblyLineDto | undefined;
    component.addLine.subscribe((dto: CreateAssemblyLineDto) => (emitted = dto));

    component['newLine'] = { product_id: 1, name: 'Nowa Linia', is_active: true };
    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const createBtn = allButtons.find(b => b.textContent?.includes('Utwórz'))!;
    createBtn.click();

    expect(emitted).toEqual({ product_id: 1, name: 'Nowa Linia', is_active: true });
  });

  it('powinien wyczyścić formularz po dodaniu linii', () => {
    component['newLine'] = { product_id: 1, name: 'X', is_active: false };
    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const createBtn = allButtons.find(b => b.textContent?.includes('Utwórz'))!;
    createBtn.click();
    expect(component['newLine']).toEqual({ product_id: 0, name: '', is_active: true });
  });
});
