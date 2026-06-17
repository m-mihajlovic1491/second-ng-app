import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AccountLanding } from './account-landing';

describe('AccountLanding', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AccountLanding],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders login and register entry points', () => {
    const fixture = TestBed.createComponent(AccountLanding);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Enter the Realm');
    expect(compiled.querySelector('a[routerLink="/login"]')?.textContent).toContain('Login');
    expect(compiled.querySelector('a[routerLink="/register"]')?.textContent).toContain('Register');
  });

  it('redirects authenticated users to the heroes page', () => {
    localStorage.setItem(
      'strategy-game-auth-session',
      JSON.stringify({
        token: 'jwt-token',
        userId: 'user-1',
        email: 'user@example.com',
        expiresAtUtc: new Date(Date.now() + 60_000).toISOString(),
      }),
    );
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    const fixture = TestBed.createComponent(AccountLanding);
    fixture.detectChanges();

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/users');
  });
});
