import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BattleAuditLog } from './battle-audit-log';

describe('BattleAuditLog', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleAuditLog],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads battle results from dedicated battle results API', () => {
    const fixture = TestBed.createComponent(BattleAuditLog);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const request = httpMock.expectOne('https://localhost:7299/battle-results?offset=0&limit=50');
    expect(request.request.method).toBe('GET');

    request.flush({
      items: [
        {
          id: 42,
          occurredAtUtc: '2026-05-14T08:00:00Z',
          heroId: 7,
          monsterId: 9,
          winnerName: 'Ares',
          winnerRemainingHealth: 12,
          loserName: 'Hydra'
        }
      ],
      totalCount: 1,
      offset: 0,
      limit: 50
    });

    expect(component.errorMessage()).toBeNull();
    expect(component.battleLogs().length).toBe(1);
    expect(component.battleLogs()[0].winnerName).toBe('Ares');
  });

  it('shows error message when API request fails', () => {
    const fixture = TestBed.createComponent(BattleAuditLog);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const request = httpMock.expectOne('https://localhost:7299/battle-results?offset=0&limit=50');
    request.flush('server unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(component.errorMessage()).toBe('Failed to load battle results.');
    expect(component.battleLogs()).toEqual([]);
  });
});
