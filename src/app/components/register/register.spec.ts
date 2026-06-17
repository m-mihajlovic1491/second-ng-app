import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Register } from './register';

const testApiBaseUrl = 'https://localhost:9876';
const endpoint = (path: string) => `${testApiBaseUrl}${path}`;
const authResponse = {
  token: 'jwt-token',
  userId: 'user-1',
  email: 'hero@example.com',
  expiresAtUtc: new Date(Date.now() + 60_000).toISOString(),
};

describe('Register', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl = testApiBaseUrl;

    await TestBed.configureTestingModule({
      imports: [Register],
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

  it('shows validation message for invalid registration input', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;

    component.emailControl.setValue('not-an-email');
    component.passwordControl.setValue('12345');
    component.register();

    expect(component.message()).toBe(
      'Enter a valid email and a password with at least 6 characters.',
    );
    expect(component.isError()).toBeTrue();
  });

  it('registers, stores the token, and redirects to users', () => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;

    component.emailControl.setValue('hero@example.com');
    component.passwordControl.setValue('password123');
    component.register();

    const request = httpMock.expectOne(endpoint('/api/auth/register'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'hero@example.com', password: 'password123' });
    request.flush(authResponse);

    const storedSession = JSON.parse(localStorage.getItem('strategy-game-auth-session') ?? '{}');
    expect(storedSession.token).toBe('jwt-token');
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/users');
  });

  it('shows backend validation array errors', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;

    component.emailControl.setValue('hero@example.com');
    component.passwordControl.setValue('password123');
    component.register();

    const request = httpMock.expectOne(endpoint('/api/auth/register'));
    request.flush([{ errorMessage: "'Email' is not a valid email address." }], {
      status: 400,
      statusText: 'Bad Request',
    });

    expect(component.message()).toBe("'Email' is not a valid email address.");
    expect(component.isError()).toBeTrue();
  });
});
