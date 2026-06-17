import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  expiresAtUtc: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

type BackendErrorItem = {
  description?: string;
  errorMessage?: string;
  code?: string;
};

const authSessionStorageKey = 'strategy-game-auth-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly authApiBaseUrl =
    (globalThis as { __authApiBaseUrl?: string }).__authApiBaseUrl ??
    'https://localhost:7101';
  private readonly session = signal<AuthSession | null>(this.readStoredSession());

  readonly currentSession = this.session.asReadonly();
  readonly isAuthenticated = computed(() => {
    const session = this.session();
    return !!session?.token && !this.isExpired(session);
  });
  readonly currentEmail = computed(() => this.session()?.email ?? null);

  register(email: string, password: string) {
    return this.httpClient
      .post<AuthSession>(`${this.authApiBaseUrl}/api/auth/register`, { email, password })
      .pipe(tap((session) => this.storeSession(session)));
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthSession>(`${this.authApiBaseUrl}/api/auth/login`, { email, password })
      .pipe(tap((session) => this.storeSession(session)));
  }

  logout(): void {
    this.session.set(null);
    this.storage?.removeItem(authSessionStorageKey);
  }

  getToken(): string | null {
    const session = this.session();

    if (!session || this.isExpired(session)) {
      this.logout();
      return null;
    }

    return session.token;
  }

  getErrorMessage(error: unknown, fallback: string): string {
    const body = (error as { error?: unknown } | null)?.error;

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    if (Array.isArray(body)) {
      const firstMessage = body
        .map((item: BackendErrorItem) => item.description ?? item.errorMessage ?? item.code)
        .find((message): message is string => !!message?.trim());

      if (firstMessage) {
        return firstMessage;
      }
    }

    return fallback;
  }

  private storeSession(session: AuthSession): void {
    this.session.set(session);
    this.storage?.setItem(authSessionStorageKey, JSON.stringify(session));
  }

  private readStoredSession(): AuthSession | null {
    const rawSession = this.storage?.getItem(authSessionStorageKey);

    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as AuthSession;
      return session.token && !this.isExpired(session) ? session : null;
    } catch {
      this.storage?.removeItem(authSessionStorageKey);
      return null;
    }
  }

  private isExpired(session: AuthSession): boolean {
    const expiresAt = Date.parse(session.expiresAtUtc);
    return Number.isFinite(expiresAt) && expiresAt <= Date.now();
  }

  private get storage(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }
}
