import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { CreateHeroForm } from './create-hero-form';

describe('CreateHeroForm', () => {
  let component: CreateHeroForm;
  let fixture: ComponentFixture<CreateHeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHeroForm],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
