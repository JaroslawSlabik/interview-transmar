import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AssemblyLine, LoginResponse, Product, Workstation, WorkstationWithOrder } from '../models/models';


@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://0.0.0.0:3000' as const;

  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem('auth_token'));

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    this.http.post<void>(`${this.apiUrl}/auth/logout`, {})
    localStorage.removeItem('auth_token');
    this.isLoggedIn.set(false);
  }

  // --- PRODUCTS ---
  getProducts(): Observable<Product[]> { return this.http.get<Product[]>(`${this.apiUrl}/products`); }
  createProduct(name: string): Observable<Product> { return this.http.post<Product>(`${this.apiUrl}/products`, { name }); }

  // --- ASSEMBLY LINES ---
  getAssemblyLines(productId?: number): Observable<AssemblyLine[]> {
    const url = productId ? `${this.apiUrl}/assemblylines?productId=${productId}` : `${this.apiUrl}/assemblylines`;
    return this.http.get<AssemblyLine[]>(url);
  }
  createAssemblyLine(data: Pick<AssemblyLine, 'product_id' | 'name' | 'is_active'>): Observable<AssemblyLine> {
    return this.http.post<AssemblyLine>(`${this.apiUrl}/assemblylines`, data);
  }
  deleteAssemblyLine(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/assemblylines/${id}`); }

  // --- WORKSTATIONS ---
  getWorkstations(): Observable<Workstation[]> { return this.http.get<Workstation[]>(`${this.apiUrl}/workstations`); }
  createWorkstation(data: Pick<Workstation, 'short_name' | 'name' | 'pc_name'>): Observable<Workstation> {
    return this.http.post<Workstation>(`${this.apiUrl}/workstations`, data);
  }

  // --- ALLOCATIONS ---
  getLineAllocations(lineId: number): Observable<WorkstationWithOrder[]> {
    return this.http.get<WorkstationWithOrder[]>(`${this.apiUrl}/allocations/line/${lineId}`);
  }
  saveLineAllocations(lineId: number, workstationIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/allocations/line/${lineId}`, { workstationIds });
  }
  removeAllocation(lineId: number, workstationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/allocations/line/${lineId}/workstation/${workstationId}`);
  }
}
