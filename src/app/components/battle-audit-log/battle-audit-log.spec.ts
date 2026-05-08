import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { BattleAuditLog } from './battle-audit-log';

describe('BattleAuditLog', () => {
  let component: BattleAuditLog;
  let fixture: ComponentFixture<BattleAuditLog>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleAuditLog],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BattleAuditLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const request = httpMock.expectOne('https://localhost:7098/api/Hero/BattleLogs');
    request.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
