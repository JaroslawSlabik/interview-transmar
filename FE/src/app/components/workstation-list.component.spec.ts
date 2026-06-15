import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WorkstationListComponent, CreateWorkstationDto } from './workstation-list.component';
import { Workstation } from '../models/models';

const mockWorkstations: Workstation[] = [
  { id: 1, short_name: 'W1', name: 'Stanowisko 1', pc_name: 'PC1', created_at: '' },
  { id: 2, short_name: 'W2', name: 'Stanowisko 2', pc_name: 'PC2', created_at: '' },
];

describe('WorkstationListComponent', () => {
  let fixture: ComponentFixture<WorkstationListComponent>;
  let component: WorkstationListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [WorkstationListComponent] });
    fixture = TestBed.createComponent(WorkstationListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('workstations', mockWorkstations);
    fixture.detectChanges();
  });

  it('powinien wyrenderować listę stanowisk', () => {
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('W1');
  });

  it('nie powinien pokazywać przycisku Alokuj gdy brak wybranej linii', () => {
    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const alokujBtns = allButtons.filter(b => b.textContent?.includes('Alokuj'));
    expect(alokujBtns.length).toBe(0);
  });

  it('powinien pokazywać przyciski Alokuj gdy selectedLineId jest ustawiony', () => {
    fixture.componentRef.setInput('selectedLineId', 10);
    fixture.detectChanges();
    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const alokujBtns = allButtons.filter(b => b.textContent?.includes('Alokuj'));
    expect(alokujBtns.length).toBe(2);
  });

  it('powinien emitować allocate po kliknięciu Alokuj', () => {
    fixture.componentRef.setInput('selectedLineId', 10);
    fixture.detectChanges();

    let emitted: Workstation | undefined;
    component.allocate.subscribe((w: Workstation) => (emitted = w));

    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const alokujBtns = allButtons.filter(b => b.textContent?.includes('Alokuj'));
    alokujBtns[0].click();
    expect(emitted?.id).toBe(1);
  });

  it('powinien emitować addWorkstation z dto po kliknięciu Dodaj Stanowisko', () => {
    let emitted: CreateWorkstationDto | undefined;
    component.addWorkstation.subscribe((dto: CreateWorkstationDto) => (emitted = dto));

    component['newWorkstation'] = { short_name: 'W3', name: 'WS3', pc_name: 'PC3' };
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual({ short_name: 'W3', name: 'WS3', pc_name: 'PC3' });
  });

  it('powinien wyczyścić formularz po dodaniu stanowiska', () => {
    component['newWorkstation'] = { short_name: 'W3', name: 'WS3', pc_name: 'PC3' };
    fixture.nativeElement.querySelector('button').click();
    expect(component['newWorkstation']).toEqual({ short_name: '', name: '', pc_name: '' });
  });
});
