import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTableComponent } from './body';

describe('HeroTableComponent', () => {
  let component: HeroTableComponent;
  let fixture: ComponentFixture<HeroTableComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTableComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HeroTableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const request = httpMock.expectOne('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10');
    request.flush([]);

    expect(component).toBeTruthy();
    expect(component.hero()).toEqual([]);
  });
});
