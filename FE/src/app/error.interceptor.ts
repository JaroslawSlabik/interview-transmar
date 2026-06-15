import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { ToastService } from './services/toast.service';

const REQUEST_TIMEOUT_MS = 3000;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    timeout(REQUEST_TIMEOUT_MS),
    catchError((error: HttpErrorResponse | TimeoutError) => {
      if (error instanceof TimeoutError) {
        toastService.showError('Brak odpowiedzi serwera');
        return EMPTY;
      }

      if (error.status === 401 && req.url.includes('/auth/login')) {
        return throwError(() => error);
      }

      const body = error.error as { message?: string } | null;
      const detail =
        typeof body?.message === 'string'
          ? body.message
          : error.status === 0
            ? 'Brak połączenia z serwerem'
            : (error.message ?? 'Nieznany błąd');

      toastService.showError(`[${error.status}] ${detail}`);

      return EMPTY;
    })
  );
};
