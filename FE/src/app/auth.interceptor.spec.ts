import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

const executeInterceptor = (
  interceptor: HttpInterceptorFn,
  req: HttpRequest<unknown>
): { capturedReq: HttpRequest<unknown> } => {
  const result = { capturedReq: req };
  const next: HttpHandlerFn = (r) => {
    result.capturedReq = r as HttpRequest<unknown>;
    return of({} as HttpEvent<unknown>);
  };
  TestBed.runInInjectionContext(() => interceptor(req, next));
  return result;
};

describe('authInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => localStorage.clear());

  it('powinien dodać nagłówek Authentication gdy token istnieje w localStorage', () => {
    localStorage.setItem('auth_token', 'mój-token');
    const req = new HttpRequest('GET', '/products');

    const { capturedReq } = executeInterceptor(authInterceptor, req);

    expect(capturedReq.headers.get('Authentication')).toBe('mój-token');
  });

  it('nie powinien dodawać nagłówka gdy brak tokenu w localStorage', () => {
    const req = new HttpRequest('GET', '/products');

    const { capturedReq } = executeInterceptor(authInterceptor, req);

    expect(capturedReq.headers.has('Authentication')).toBe(false);
  });

  it('powinien przekazać oryginalne zapytanie bez zmian gdy brak tokenu', () => {
    const req = new HttpRequest('POST', '/auth/login', { username: 'a' });

    const { capturedReq } = executeInterceptor(authInterceptor, req);

    expect(capturedReq).toBe(req);
  });

  it('powinien zachować istniejące nagłówki i dodać Authentication', () => {
    localStorage.setItem('auth_token', 'tok-xyz');
    const req = new HttpRequest('GET', '/products', null, {
      headers: new (require('@angular/common/http').HttpHeaders)({ 'X-Custom': 'value' }),
    });

    const { capturedReq } = executeInterceptor(authInterceptor, req);

    expect(capturedReq.headers.get('Authentication')).toBe('tok-xyz');
    expect(capturedReq.headers.get('X-Custom')).toBe('value');
  });
});
