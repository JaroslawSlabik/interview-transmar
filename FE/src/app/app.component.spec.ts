import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';

const API = 'http://0.0.0.0:3000';

const mockProducts = [
  { id: 1, name: 'Produkt A', created_at: '' },
  { id: 2, name: 'Produkt B', created_at: '' },
];

const mockLines = [
  { id: 10, product_id: 1, name: 'Linia 1', is_active: true, created_at: '' },
];

const mockWorkstations = [
  { id: 100, short_name: 'W1', name: 'Stanowisko 1', pc_name: 'PC1', created_at: '' },
];

const mockAllocated = [
  { id: 100, short_name: 'W1', name: 'Stanowisko 1', pc_name: 'PC1', created_at: '', display_order: 0 },
  { id: 101, short_name: 'W2', name: 'Stanowisko 2', pc_name: 'PC2', created_at: '', display_order: 1 },
];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // --- Stan początkowy ---

  it('powinien pokazać app-login-form gdy użytkownik jest wylogowany', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-login-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-product-list')).toBeNull();
  });

  it('nie powinien ładować danych przy init gdy użytkownik jest wylogowany', () => {
    fixture.detectChanges();
    httpMock.expectNone(`${API}/products`);
  });

  it('powinien załadować dane i pokazać komponenty po zalogowaniu', fakeAsync(() => {
    localStorage.setItem('auth_token', 'test-token');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(AppComponent);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    httpMock.expectOne(`${API}/products`).flush(mockProducts);
    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines);
    httpMock.expectOne(`${API}/workstations`).flush(mockWorkstations);
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-list')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-workstation-list')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-assembly-line-list')).not.toBeNull();
  }));

  // --- handleLogin ---

  it('handleLogin() powinien zalogować i załadować dane', fakeAsync(() => {
    fixture.detectChanges();

    component['handleLogin']({ username: 'admin', password: 'pass' });

    httpMock.expectOne(`${API}/auth/login`).flush({ token: 'tok', message: 'ok', expires_in: '1h' });
    httpMock.expectOne(`${API}/products`).flush(mockProducts);
    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines);
    httpMock.expectOne(`${API}/workstations`).flush(mockWorkstations);
    tick();

    expect(apiService.isLoggedIn()).toBe(true);
    expect(component['loginError']()).toBe('');
  }));

  it('handleLogin() powinien ustawić loginError przy błędzie logowania', fakeAsync(() => {
    fixture.detectChanges();

    component['handleLogin']({ username: 'admin', password: 'zle' });

    httpMock.expectOne(`${API}/auth/login`).flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' }
    );
    tick();

    expect(component['loginError']()).toBe('Błędne dane logowania!');
  }));

  // --- handleLogout ---

  it('handleLogout() powinien wylogować użytkownika', fakeAsync(() => {
    apiService.isLoggedIn.set(true);
    localStorage.setItem('auth_token', 'tok');
    fixture.detectChanges();

    httpMock.expectOne(`${API}/products`).flush([]);
    httpMock.expectOne(`${API}/assemblylines`).flush([]);
    httpMock.expectOne(`${API}/workstations`).flush([]);
    tick();

    component['handleLogout']();

    expect(apiService.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  }));

  // --- onAddProduct ---

  it('onAddProduct() powinien wywołać createProduct i odświeżyć dane', fakeAsync(() => {
    fixture.detectChanges();

    component['onAddProduct']('Nowy Produkt');

    httpMock.expectOne(`${API}/products`).flush({ id: 3, name: 'Nowy Produkt', created_at: '' });
    httpMock.expectOne(`${API}/products`).flush(mockProducts);
    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines);
    httpMock.expectOne(`${API}/workstations`).flush(mockWorkstations);
    tick();

    expect(component['products']()).toEqual(mockProducts);
  }));

  // --- onAddAssemblyLine ---

  it('onAddAssemblyLine() powinien wywołać createAssemblyLine i odświeżyć linie', fakeAsync(() => {
    fixture.detectChanges();

    component['onAddAssemblyLine']({ product_id: 1, name: 'Nowa Linia', is_active: true });

    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines[0]);
    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines);
    tick();

    expect(component['assemblyLines']()).toEqual(mockLines);
  }));

  // --- onDeleteLine ---

  it('onDeleteLine() powinien usunąć linię i odświeżyć listę', fakeAsync(() => {
    fixture.detectChanges();

    component['onDeleteLine'](10);

    httpMock.expectOne(`${API}/assemblylines/10`).flush(null);
    httpMock.expectOne(`${API}/assemblylines`).flush([]);
    tick();

    expect(component['assemblyLines']()).toEqual([]);
  }));

  // --- onFilterProductChange ---

  it('onFilterProductChange() powinien zaktualizować filtr i załadować linie', fakeAsync(() => {
    fixture.detectChanges();

    component['onFilterProductChange'](1);

    expect(component['selectedFilterProductId']()).toBe(1);
    httpMock.expectOne(`${API}/assemblylines?productId=1`).flush(mockLines);
    tick();
  }));

  it('onFilterProductChange(null) powinien załadować wszystkie linie', fakeAsync(() => {
    fixture.detectChanges();

    component['onFilterProductChange'](null);

    expect(component['selectedFilterProductId']()).toBeNull();
    httpMock.expectOne(`${API}/assemblylines`).flush(mockLines);
    tick();
  }));

  // --- onSelectLine ---

  it('onSelectLine() powinien ustawić selectedLineId i załadować alokacje', fakeAsync(() => {
    fixture.detectChanges();

    component['onSelectLine'](10);

    expect(component['selectedLineId']()).toBe(10);
    httpMock.expectOne(`${API}/allocations/line/10`).flush(mockAllocated);
    tick();

    expect(component['allocatedWorkstations']().length).toBe(2);
  }));

  // --- onAllocateWorkstation ---

  it('onAllocateWorkstation() powinien dodać stanowisko i zapisać kolejność', fakeAsync(() => {
    fixture.detectChanges();
    component['selectedLineId'].set(10);
    component['allocatedWorkstations'].set([]);

    component['onAllocateWorkstation'](mockWorkstations[0]);

    expect(component['allocatedWorkstations']().length).toBe(1);
    httpMock.expectOne(`${API}/allocations/line/10`).flush({});
    tick();
  }));

  it('onAllocateWorkstation() nie powinien dodać stanowiska gdy już jest na liście', () => {
    component['selectedLineId'].set(10);
    component['allocatedWorkstations'].set([{ ...mockWorkstations[0], display_order: 0 }]);

    component['onAllocateWorkstation'](mockWorkstations[0]);

    expect(component['allocatedWorkstations']().length).toBe(1);
    httpMock.expectNone(`${API}/allocations/line/10`);
  });

  // --- onMoveAllocation ---

  it('onMoveAllocation down powinien zamienić miejscami elementy', fakeAsync(() => {
    fixture.detectChanges();
    component['selectedLineId'].set(10);
    component['allocatedWorkstations'].set([
      { ...mockWorkstations[0], display_order: 0 },
      { id: 101, short_name: 'W2', name: 'WS2', pc_name: 'PC2', created_at: '', display_order: 1 },
    ]);

    component['onMoveAllocation']({ index: 0, direction: 'down' });

    expect(component['allocatedWorkstations']()[0].id).toBe(101);
    expect(component['allocatedWorkstations']()[1].id).toBe(100);
    httpMock.expectOne(`${API}/allocations/line/10`).flush({});
    tick();
  }));

  it('onMoveAllocation up na pierwszym elemencie nie powinien nic robić', () => {
    component['selectedLineId'].set(10);
    component['allocatedWorkstations'].set([{ ...mockWorkstations[0], display_order: 0 }]);

    component['onMoveAllocation']({ index: 0, direction: 'up' });

    expect(component['allocatedWorkstations']()[0].id).toBe(100);
    httpMock.expectNone(`${API}/allocations/line/10`);
  });

  // --- onRemoveAllocation ---

  it('onRemoveAllocation() powinien usunąć stanowisko z listy', fakeAsync(() => {
    fixture.detectChanges();
    component['selectedLineId'].set(10);
    component['allocatedWorkstations'].set([{ ...mockWorkstations[0], display_order: 0 }]);

    component['onRemoveAllocation'](100);

    httpMock.expectOne(`${API}/allocations/line/10/workstation/100`).flush(null);
    httpMock.expectOne(`${API}/allocations/line/10`).flush({});
    tick();

    expect(component['allocatedWorkstations']().length).toBe(0);
  }));

  it('onRemoveAllocation() nie powinien nic robić gdy brak selectedLineId', () => {
    component['selectedLineId'].set(null);

    component['onRemoveAllocation'](100);

    httpMock.expectNone(`${API}/allocations/line/null/workstation/100`);
  });
});
