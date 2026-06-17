import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Login } from './login';

const testApiBaseUrl = 'https://localhost:9876';
const endpoint = (path: string) => `${testApiBaseUrl}${path}`;
const authResponse = {
  token: 'jwt-token',
  userId: 'user-1',
  email: 'hero@example.com',
  expiresAtUtc: new Date(Date.now() + 60_000).toISOString(),
};

describe('Login', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl = testApiBaseUrl;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    delete (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl;
  });

  it('shows validation message for invalid login input', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.emailControl.setValue('not-an-email');
    component.passwordControl.setValue('');
    component.login();

    expect(component.message()).toBe('Enter a valid email and password.');
    expect(component.isError()).toBeTrue();
  });

  it('logs in, stores the token, and redirects to users', () => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.emailControl.setValue('hero@example.com');
    component.passwordControl.setValue('pw');
    component.login();

    const request = httpMock.expectOne(endpoint('/api/auth/login'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'hero@example.com', password: 'pw' });
    request.flush(authResponse);

    const storedSession = JSON.parse(localStorage.getItem('strategy-game-auth-session') ?? '{}');
    expect(storedSession.token).toBe('jwt-token');
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/users');
  });

  it('shows string API errors from invalid credentials', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.emailControl.setValue('hero@example.com');
    component.passwordControl.setValue('wrong-password');
    component.login();

    const request = httpMock.expectOne(endpoint('/api/auth/login'));
    request.flush('Invalid email or password.', { status: 401, statusText: 'Unauthorized' });

    expect(component.message()).toBe('Invalid email or password.');
    expect(component.isError()).toBeTrue();
  });
});
