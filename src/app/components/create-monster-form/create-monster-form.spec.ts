import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CreateMonsterForm } from './create-monster-form';

const testApiBaseUrl = 'https://localhost:9876';
const endpoint = (path: string) => `${testApiBaseUrl}${path}`;

describe('CreateMonsterForm', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl = testApiBaseUrl;

    await TestBed.configureTestingModule({
      imports: [CreateMonsterForm],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    delete (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl;
  });

  it('posts to create monster endpoint and shows success message', () => {
    const fixture = TestBed.createComponent(CreateMonsterForm);
    const component = fixture.componentInstance;

    component.nameControl.setValue('Orc');
    component.damageControl.setValue('12');
    component.defenseControl.setValue('5');
    component.createMonster();

    const request = httpMock.expectOne(endpoint('/api/Monster'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Orc', damage: 12, defense: 5 });

    request.flush('monster Orc saved to database');
    expect(component.message()).toBe('Monster created successfully.');
  });

  it('shows API error when create monster request fails', () => {
    const fixture = TestBed.createComponent(CreateMonsterForm);
    const component = fixture.componentInstance;

    component.nameControl.setValue('Orc');
    component.damageControl.setValue('12');
    component.defenseControl.setValue('5');
    component.createMonster();

    const request = httpMock.expectOne(endpoint('/api/Monster'));
    request.flush({ message: 'monster validation failed' }, { status: 400, statusText: 'Bad Request' });

    expect(component.message()).toContain('monster validation failed');
  });
});
