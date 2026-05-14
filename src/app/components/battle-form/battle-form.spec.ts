import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BattleFormComponent } from './battle-form';

describe('BattleFormComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleFormComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads heroes and monsters on init', () => {
    const fixture = TestBed.createComponent(BattleFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const heroesRequest = httpMock.expectOne('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10');
    const monstersRequest = httpMock.expectOne(
      'https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10'
    );

    heroesRequest.flush([{ id: 1, name: 'Arthur', health: 90 }]);
    monstersRequest.flush([{ id: 2, name: 'Goblin', health: 70 }]);

    expect(component.heroes().length).toBe(1);
    expect(component.monsters().length).toBe(1);
    expect(component.isLoadingRoster()).toBeFalse();
  });

  it('shows validation error when selections are missing', () => {
    const fixture = TestBed.createComponent(BattleFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10').flush([]);
    httpMock.expectOne('https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10').flush([]);

    component.startBattle();

    expect(component.errorMessage()).toBe('Select both a hero and a monster to start the battle.');
  });

  it('posts battle request and stores response text', () => {
    const fixture = TestBed.createComponent(BattleFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10').flush([
      { id: 1, name: 'Arthur', health: 90 }
    ]);
    httpMock.expectOne('https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10').flush([
      { id: 2, name: 'Goblin', health: 70 }
    ]);

    component.heroControl.setValue(1);
    component.monsterControl.setValue(2);

    component.startBattle();

    const battleRequest = httpMock.expectOne('https://localhost:7098/battle/1/2');
    expect(battleRequest.request.method).toBe('POST');
    battleRequest.flush('Battle ended.\n Hero health: 50\n Monster health: 0');

    expect(component.message()).toContain('Battle ended.');
    expect(component.errorMessage()).toBeNull();
    expect(component.isBattleInProgress()).toBeFalse();
  });

  it('shows API error when battle endpoint fails', () => {
    const fixture = TestBed.createComponent(BattleFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    httpMock.expectOne('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10').flush([
      { id: 1, name: 'Arthur', health: 90 }
    ]);
    httpMock.expectOne('https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10').flush([
      { id: 2, name: 'Goblin', health: 70 }
    ]);

    component.heroControl.setValue(1);
    component.monsterControl.setValue(2);

    component.startBattle();

    const battleRequest = httpMock.expectOne('https://localhost:7098/battle/1/2');
    battleRequest.flush('Monster not found', { status: 404, statusText: 'Not Found' });

    expect(component.errorMessage()).toBe('Monster not found');
    expect(component.message()).toBeNull();
    expect(component.isBattleInProgress()).toBeFalse();
  });
});
