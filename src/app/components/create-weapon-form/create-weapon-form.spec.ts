import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CreateWeaponForm } from './create-weapon-form';

describe('CreateWeaponForm', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeaponForm],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows validation message when name is missing', () => {
    const fixture = TestBed.createComponent(CreateWeaponForm);
    const component = fixture.componentInstance;

    component.nameControl.setValue('');
    component.damageControl.setValue('15');

    component.createWeapon();

    expect(component.message()).toBe('Weapon name is required.');
  });

  it('posts to create weapon endpoint and shows success message', () => {
    const fixture = TestBed.createComponent(CreateWeaponForm);
    const component = fixture.componentInstance;

    component.nameControl.setValue('Sword');
    component.damageControl.setValue('15');

    component.createWeapon();

    const request = httpMock.expectOne('https://localhost:7098/api/Weapon/Weapon');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Sword', damage: 15 });

    request.flush('weapon Sword saved to database');
    expect(component.message()).toBe('Weapon created successfully.');
  });
});
