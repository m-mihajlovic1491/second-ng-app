import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token || !isApiRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};

function isApiRequest(url: string): boolean {
  const strategyGameApiBaseUrl =
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl ??
    'https://localhost:7098';
  const battleResultsApiBaseUrl =
    (globalThis as { __battleResultsApiBaseUrl?: string }).__battleResultsApiBaseUrl ??
    'https://localhost:7299';

  return (
    url.startsWith('/api/') ||
    url.startsWith(strategyGameApiBaseUrl) ||
    url.startsWith(battleResultsApiBaseUrl)
  );
}
