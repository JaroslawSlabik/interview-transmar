import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AllocationPanelComponent } from './allocation-panel.component';
import { WorkstationWithOrder } from '../models/models';

const mockAllocated: WorkstationWithOrder[] = [
  { id: 100, short_name: 'W1', name: 'Stanowisko 1', pc_name: 'PC1', created_at: '', display_order: 0 },
  { id: 101, short_name: 'W2', name: 'Stanowisko 2', pc_name: 'PC2', created_at: '', display_order: 1 },
];

describe('AllocationPanelComponent', () => {
  let fixture: ComponentFixture<AllocationPanelComponent>;
  let component: AllocationPanelComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AllocationPanelComponent] });
    fixture = TestBed.createComponent(AllocationPanelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('allocatedWorkstations', mockAllocated);
    fixture.componentRef.setInput('selectedLineId', 10);
    fixture.detectChanges();
  });

  it('powinien wyrenderować ID wybranej linii w nagłówku', () => {
    expect(fixture.nativeElement.textContent).toContain('10');
  });

  it('powinien wyrenderować elementy listy dla każdego stanowiska', () => {
    const items = fixture.nativeElement.querySelectorAll('li:not(.empty)');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('W1');
    expect(items[1].textContent).toContain('W2');
  });

  it('powinien pokazać komunikat gdy brak stanowisk', () => {
    fixture.componentRef.setInput('allocatedWorkstations', []);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Brak');
  });

  it('powinien wyświetlić odznakę z numerem porządkowym', () => {
    const items = fixture.nativeElement.querySelectorAll('ul li');
    const badge0 = items[0].querySelector('span:first-child') as HTMLElement;
    const badge1 = items[1].querySelector('span:first-child') as HTMLElement;
    expect(badge0.textContent?.trim()).toBe('1');
    expect(badge1.textContent?.trim()).toBe('2');
  });

  it('przycisk 🔼 pierwszego elementu powinien być wyłączony', () => {
    const upButtons = fixture.nativeElement.querySelectorAll('button[disabled]');
    expect(upButtons.length).toBeGreaterThan(0);
  });

  it('powinien emitować move z { index, direction: up } po kliknięciu w górę', () => {
    let emitted: { index: number; direction: 'up' | 'down' } | undefined;
    component.move.subscribe((e) => (emitted = e));

    // The second item's up-button is enabled
    const listItems = fixture.nativeElement.querySelectorAll('ul li');
    const upBtn = listItems[1].querySelectorAll('button')[0] as HTMLButtonElement;
    upBtn.click();

    expect(emitted).toEqual({ index: 1, direction: 'up' });
  });

  it('powinien emitować move z { index, direction: down } po kliknięciu w dół', () => {
    let emitted: { index: number; direction: 'up' | 'down' } | undefined;
    component.move.subscribe((e) => (emitted = e));

    const listItems = fixture.nativeElement.querySelectorAll('ul li');
    const downBtn = listItems[0].querySelectorAll('button')[1] as HTMLButtonElement;
    downBtn.click();

    expect(emitted).toEqual({ index: 0, direction: 'down' });
  });

  it('powinien emitować remove z id stanowiska po kliknięciu Usuń', () => {
    let emitted: number | undefined;
    component.remove.subscribe((id: number) => (emitted = id));

    const listItems = fixture.nativeElement.querySelectorAll('ul li');
    const allButtons = Array.from(listItems[0].querySelectorAll('button')) as HTMLButtonElement[];
    const usunBtn = allButtons.find(b => b.textContent?.trim() === 'Usuń')!;
    usunBtn.click();

    expect(emitted).toBe(100);
  });
});
