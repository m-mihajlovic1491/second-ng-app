import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CreateHeroForm } from './create-hero-form';

const testApiBaseUrl = 'https://localhost:9876';
const endpoint = (path: string) => `${testApiBaseUrl}${path}`;

describe('CreateHeroForm', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl = testApiBaseUrl;

    await TestBed.configureTestingModule({
      imports: [CreateHeroForm],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    delete (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl;
  });

  it('shows validation message when hero name is missing', () => {
    const fixture = TestBed.createComponent(CreateHeroForm);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(endpoint('/api/Weapon/Weapons')).flush([]);

    component.heroNameControl.setValue('');
    component.createHero();

    expect(component.message()).toBe('Hero name is required.');
    expect(component.isError()).toBeTrue();
  });

  it('creates hero without assigning weapon when no weapon selected', () => {
    const fixture = TestBed.createComponent(CreateHeroForm);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(endpoint('/api/Weapon/Weapons')).flush([]);

    component.heroNameControl.setValue('Ares');
    component.weaponControl.setValue(null);
    component.createHero();

    const createRequest = httpMock.expectOne(endpoint('/api/Hero'));
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({ name: 'Ares' });
    createRequest.flush('Hero Ares saved to database');

    expect(component.message()).toBe('Hero created successfully.');
    expect(component.isError()).toBeFalse();
  });

  it('creates hero and assigns selected weapon', () => {
    const fixture = TestBed.createComponent(CreateHeroForm);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(endpoint('/api/Weapon/Weapons')).flush([{ id: 3, name: 'Sword', damage: 18 }]);

    component.heroNameControl.setValue('Ares');
    component.weaponControl.setValue(3);
    component.createHero();

    const createRequest = httpMock.expectOne(endpoint('/api/Hero'));
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual({ name: 'Ares', weaponId: 3 });
    createRequest.flush('Hero Ares saved to database');

    expect(component.message()).toBe('Hero created and weapon assigned successfully.');
    expect(component.isError()).toBeFalse();
  });

  it('shows API error when create hero request fails', () => {
    const fixture = TestBed.createComponent(CreateHeroForm);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(endpoint('/api/Weapon/Weapons')).flush([]);

    component.heroNameControl.setValue('Ares');
    component.createHero();

    const createRequest = httpMock.expectOne(endpoint('/api/Hero'));
    createRequest.flush('hero validation failed', { status: 400, statusText: 'Bad Request' });

    expect(component.message()).toBe('hero validation failed');
    expect(component.isError()).toBeTrue();
  });

  it('shows API error when create hero with weapon request fails', () => {
    const fixture = TestBed.createComponent(CreateHeroForm);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    httpMock.expectOne(endpoint('/api/Weapon/Weapons')).flush([{ id: 3, name: 'Sword', damage: 18 }]);

    component.heroNameControl.setValue('Ares');
    component.weaponControl.setValue(3);
    component.createHero();

    const createRequest = httpMock.expectOne(endpoint('/api/Hero'));
    expect(createRequest.request.body).toEqual({ name: 'Ares', weaponId: 3 });
    createRequest.flush('weapon not found', { status: 404, statusText: 'Not Found' });

    expect(component.message()).toBe('weapon not found');
    expect(component.isError()).toBeTrue();
  });
});
