import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

const testApiBaseUrl = 'https://localhost:9876';
const endpoint = (path: string) => `${testApiBaseUrl}${path}`;

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl = testApiBaseUrl;

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    delete (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render toolbar title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toolbar-title')?.textContent).toContain('Realm Command');
  });

  it('renders global bulk heal button', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>('.bulk-heal-button');

    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('Heal All');
  });

  it('calls bulk heal endpoint, shows healed counts, and refreshes current page', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
    component.healAllCombatants();

    expect(component.isHealingCombatants()).toBeTrue();

    const request = httpMock.expectOne(endpoint('/api/combatants/bulkheal'));
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toBeNull();

    request.flush({ heroesHealed: 2, monstersHealed: 3 });
    fixture.detectChanges();
    await Promise.resolve();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.isHealingCombatants()).toBeFalse();
    expect(component.bulkHealIsError()).toBeFalse();
    expect(compiled.querySelector('.toolbar-message')?.textContent).toContain(
      'Healed 2 heroes and 3 monsters.'
    );
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/', { skipLocationChange: true });
    expect(navigateByUrlSpy).toHaveBeenCalledWith(router.url);
  });

  it('shows error when bulk heal request fails', async () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
    component.healAllCombatants();

    const request = httpMock.expectOne(endpoint('/api/combatants/bulkheal'));
    request.flush('bulk heal failed', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await Promise.resolve();

    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('.toolbar-message');

    expect(component.isHealingCombatants()).toBeFalse();
    expect(component.bulkHealIsError()).toBeTrue();
    expect(message?.textContent).toContain('bulk heal failed');
    expect(message?.classList).toContain('error');
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });
});
