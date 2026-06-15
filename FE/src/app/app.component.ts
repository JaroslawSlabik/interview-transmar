import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from './services/api.service';
import { AssemblyLine, Product, Workstation, WorkstationWithOrder } from './models/models';
import { LoginFormComponent, LoginCredentials } from './components/login-form.component';
import { ProductListComponent } from './components/product-list.component';
import { WorkstationListComponent, CreateWorkstationDto } from './components/workstation-list.component';
import { AssemblyLineListComponent, CreateAssemblyLineDto } from './components/assembly-line-list.component';
import { AllocationPanelComponent } from './components/allocation-panel.component';
import { ToastComponent } from './components/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginFormComponent,
    ProductListComponent,
    WorkstationListComponent,
    AssemblyLineListComponent,
    AllocationPanelComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly isLoggedIn = this.api.isLoggedIn.asReadonly();
  protected readonly loginError = signal('');
  protected readonly products = signal<Product[]>([]);
  protected readonly assemblyLines = signal<AssemblyLine[]>([]);
  protected readonly workstations = signal<Workstation[]>([]);
  protected readonly allocatedWorkstations = signal<WorkstationWithOrder[]>([]);
  protected readonly selectedFilterProductId = signal<number | null>(null);
  protected readonly selectedLineId = signal<number | null>(null);

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loadAllData();
    }
  }

  protected handleLogin(credentials: LoginCredentials): void {
    this.api.login(credentials.username, credentials.password).subscribe({
      next: () => { this.loadAllData(); this.loginError.set(''); },
      error: () => this.loginError.set('Błędne dane logowania!')
    });
  }

  protected handleLogout(): void {
    this.api.logout();
  }

  private loadAllData(): void {
    this.api.getProducts().subscribe(data => this.products.set(data));
    this.loadLines();
    this.api.getWorkstations().subscribe(data => this.workstations.set(data));
  }

  private loadLines(): void {
    this.api.getAssemblyLines(this.selectedFilterProductId() ?? undefined)
      .subscribe(data => this.assemblyLines.set(data));
  }

  protected onFilterProductChange(id: number | null): void {
    this.selectedFilterProductId.set(id);
    this.loadLines();
  }

  protected onAddProduct(name: string): void {
    this.api.createProduct(name).subscribe(() => this.loadAllData());
  }

  protected onAddAssemblyLine(dto: CreateAssemblyLineDto): void {
    this.api.createAssemblyLine(dto).subscribe(() => this.loadLines());
  }

  protected onDeleteLine(id: number): void {
    this.api.deleteAssemblyLine(id).subscribe(() => this.loadLines());
  }

  protected onAddWorkstation(dto: CreateWorkstationDto): void {
    this.api.createWorkstation(dto).subscribe(() => {
      this.api.getWorkstations().subscribe(data => this.workstations.set(data));
    });
  }

  protected onSelectLine(lineId: number): void {
    this.selectedLineId.set(lineId);
    this.api.getLineAllocations(lineId).subscribe(data => this.allocatedWorkstations.set(data));
  }

  protected onAllocateWorkstation(workstation: Workstation): void {
    if (this.allocatedWorkstations().some(w => w.id === workstation.id)) return;

    const updatedList: WorkstationWithOrder[] = [
      ...this.allocatedWorkstations(),
      { ...workstation, display_order: this.allocatedWorkstations().length }
    ];
    this.allocatedWorkstations.set(updatedList);
    this.saveCurrentOrder();
  }

  protected onMoveAllocation(event: { index: number; direction: 'up' | 'down' }): void {
    const list = [...this.allocatedWorkstations()];
    const targetIndex = event.direction === 'up' ? event.index - 1 : event.index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    [list[event.index], list[targetIndex]] = [list[targetIndex], list[event.index]];

    this.allocatedWorkstations.set(list);
    this.saveCurrentOrder();
  }

  protected onRemoveAllocation(workstationId: number): void {
    const lineId = this.selectedLineId();
    if (!lineId) return;

    this.api.removeAllocation(lineId, workstationId).subscribe(() => {
      const updated = this.allocatedWorkstations().filter(w => w.id !== workstationId);
      this.allocatedWorkstations.set(updated);
      this.saveCurrentOrder();
    });
  }

  private saveCurrentOrder(): void {
    const lineId = this.selectedLineId();
    if (!lineId) return;
    const ids = this.allocatedWorkstations().map(w => Number(w.id));
    this.api.saveLineAllocations(lineId, ids).subscribe();
  }
}

