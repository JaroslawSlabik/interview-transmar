import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const API = 'http://0.0.0.0:3000';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // --- isLoggedIn signal ---

  it('isLoggedIn() powinno być false gdy brak tokenu w localStorage', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('isLoggedIn() powinno być true gdy token jest już w localStorage', () => {
    localStorage.setItem('auth_token', 'existing-token');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiService],
    });
    const freshService = TestBed.inject(ApiService);
    TestBed.inject(HttpTestingController); // reinit mock
    expect(freshService.isLoggedIn()).toBe(true);
  });

  // --- login ---

  it('login() powinien ustawić token w localStorage i isLoggedIn na true', () => {
    service.login('admin', 'pass').subscribe();

    const req = httpMock.expectOne(`${API}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'admin', password: 'pass' });
    req.flush({ token: 'tok-123', message: 'Login successful', expires_in: '1h' });

    expect(localStorage.getItem('auth_token')).toBe('tok-123');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('login() nie powinien zapisywać tokenu gdy odpowiedź go nie zawiera', () => {
    service.login('user', 'wrong').subscribe();

    httpMock.expectOne(`${API}/auth/login`).flush({ message: 'error' });

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  // --- logout ---

  it('logout() powinien usunąć token i ustawić isLoggedIn na false', () => {
    localStorage.setItem('auth_token', 'tok-123');
    service.isLoggedIn.set(true);

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  // --- getProducts ---

  it('getProducts() powinien wysłać GET /products', () => {
    const mockProducts = [{ id: 1, name: 'Produkt A', created_at: '' }];
    service.getProducts().subscribe(data => expect(data).toEqual(mockProducts));

    const req = httpMock.expectOne(`${API}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  // --- createProduct ---

  it('createProduct() powinien wysłać POST /products z nazwą', () => {
    const mockProduct = { id: 2, name: 'Nowy', created_at: '' };
    service.createProduct('Nowy').subscribe(data => expect(data).toEqual(mockProduct));

    const req = httpMock.expectOne(`${API}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Nowy' });
    req.flush(mockProduct);
  });

  // --- getAssemblyLines ---

  it('getAssemblyLines() bez filtra powinien wywołać /assemblylines', () => {
    service.getAssemblyLines().subscribe();
    httpMock.expectOne(`${API}/assemblylines`).flush([]);
  });

  it('getAssemblyLines(id) z filtrem powinien dodać query param productId', () => {
    service.getAssemblyLines(5).subscribe();
    httpMock.expectOne(`${API}/assemblylines?productId=5`).flush([]);
  });

  // --- deleteAssemblyLine ---

  it('deleteAssemblyLine() powinien wysłać DELETE /assemblylines/:id', () => {
    service.deleteAssemblyLine(3).subscribe();

    const req = httpMock.expectOne(`${API}/assemblylines/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  // --- getWorkstations ---

  it('getWorkstations() powinien wysłać GET /workstations', () => {
    service.getWorkstations().subscribe();
    httpMock.expectOne(`${API}/workstations`).flush([]);
  });

  // --- createWorkstation ---

  it('createWorkstation() powinien wysłać POST /workstations', () => {
    const dto = { short_name: 'W1', name: 'Stanowisko', pc_name: 'PC1' };
    service.createWorkstation(dto).subscribe();

    const req = httpMock.expectOne(`${API}/workstations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: 1, ...dto, created_at: '' });
  });

  // --- getLineAllocations ---

  it('getLineAllocations() powinien wysłać GET /allocations/line/:id', () => {
    service.getLineAllocations(7).subscribe();
    httpMock.expectOne(`${API}/allocations/line/7`).flush([]);
  });

  // --- saveLineAllocations ---

  it('saveLineAllocations() powinien wysłać POST z tablicą id', () => {
    service.saveLineAllocations(7, [1, 2, 3]).subscribe();

    const req = httpMock.expectOne(`${API}/allocations/line/7`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ workstationIds: [1, 2, 3] });
    req.flush({});
  });

  // --- removeAllocation ---

  it('removeAllocation() powinien wysłać DELETE /allocations/line/:lineId/workstation/:wsId', () => {
    service.removeAllocation(7, 2).subscribe();

    const req = httpMock.expectOne(`${API}/allocations/line/7/workstation/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
