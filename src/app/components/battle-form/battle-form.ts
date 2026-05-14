import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { HeroModel } from '../../models/HeroModel';
import { MonsterModel } from '../../models/MonsterModel';

@Component({
  selector: 'app-battle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './battle-form.html',
  styleUrl: './battle-form.scss'
})
export class BattleFormComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl =
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl ??
    'https://localhost:7098';

  readonly heroes = signal<HeroModel[]>([]);
  readonly monsters = signal<MonsterModel[]>([]);
  readonly message = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly isLoadingRoster = signal(false);
  readonly isBattleInProgress = signal(false);

  readonly heroControl = new FormControl<number | null>(null);
  readonly monsterControl = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.loadRoster();
  }

  loadRoster(): void {
    this.isLoadingRoster.set(true);
    this.errorMessage.set(null);

    let pendingRequests = 2;
    const onRequestFinished = () => {
      pendingRequests -= 1;
      if (pendingRequests === 0) {
        this.isLoadingRoster.set(false);
      }
    };

    this.httpClient
      .get<HeroModel[]>(`${this.apiBaseUrl}/api/Hero/Heroes?pageIndex=0&pageSize=10`)
      .pipe(finalize(onRequestFinished))
      .subscribe({
        next: res => this.heroes.set(res),
        error: () => {
          this.errorMessage.set('Failed to load heroes.');
          this.heroes.set([]);
        }
      });

    this.httpClient
      .get<MonsterModel[]>(`${this.apiBaseUrl}/api/Monster/Monsters?pageIndex=0&pageSize=10`)
      .pipe(finalize(onRequestFinished))
      .subscribe({
        next: res => this.monsters.set(res),
        error: () => {
          this.errorMessage.set('Failed to load monsters.');
          this.monsters.set([]);
        }
      });
  }

  startBattle(): void {
    const heroId = this.heroControl.value;
    const monsterId = this.monsterControl.value;

    this.message.set(null);
    this.errorMessage.set(null);

    if (heroId === null || monsterId === null) {
      this.errorMessage.set('Select both a hero and a monster to start the battle.');
      return;
    }

    this.isBattleInProgress.set(true);
    this.httpClient
      .post(`${this.apiBaseUrl}/battle/${heroId}/${monsterId}`, null, { responseType: 'text' })
      .pipe(finalize(() => this.isBattleInProgress.set(false)))
      .subscribe({
        next: result => {
          this.message.set(result);
        },
        error: err => {
          this.errorMessage.set(typeof err?.error === 'string' ? err.error : 'Battle failed.');
        }
      });
  }

  heroLabel(hero: HeroModel): string {
    return `${hero.name} (HP: ${hero.health})`;
  }

  monsterLabel(monster: MonsterModel): string {
    return `${monster.name} (HP: ${monster.health})`;
  }
}
