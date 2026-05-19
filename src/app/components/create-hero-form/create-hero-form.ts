import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { HeroModel } from '../../models/HeroModel';
import { WeaponModel } from '../../models/WeaponModel';

@Component({
  selector: 'app-create-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <mat-card class="page-card form-card">
      <mat-card-header>
        <mat-card-title>Create New Hero</mat-card-title>
        <mat-card-subtitle>Add a champion to your active roster.</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Hero name</mat-label>
            <input matInput placeholder="Enter new hero name" [formControl]="heroNameControl" (keyup.enter)="createHero()">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Starting weapon (optional)</mat-label>
            <mat-select [formControl]="weaponControl">
              <mat-option [value]="null">No weapon</mat-option>
              @for (weapon of weapons(); track weapon.id) {
                <mat-option [value]="weapon.id">{{ weapon.name }} (Damage: {{ weapon.damage }})</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        @if (isLoadingWeapons()) {
          <p class="loading-note">Loading available weapons...</p>
        }
      </mat-card-content>

      <mat-card-actions class="actions-row">
        <button mat-flat-button color="primary" type="button" [disabled]="isSubmitting()" (click)="createHero()">
          Create hero
        </button>
      </mat-card-actions>

      @if (message()) {
        <div class="message" [class.error]="isError()">
          {{ message() }}
        </div>
      }
    </mat-card>
  `,
  styleUrl: './create-hero-form.scss'
})
export class CreateHeroForm implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl =
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl ??
    'https://localhost:7098';

  readonly heroNameControl = new FormControl('');
  readonly weaponControl = new FormControl<number | null>(null);
  readonly weapons = signal<WeaponModel[]>([]);
  readonly isLoadingWeapons = signal(false);
  readonly isSubmitting = signal(false);
  readonly message = signal<string | null>(null);
  readonly isError = signal(false);

  ngOnInit(): void {
    this.loadWeapons();
  }

  loadWeapons(): void {
    this.isLoadingWeapons.set(true);
    this.httpClient
      .get<WeaponModel[]>(`${this.apiBaseUrl}/api/Weapon/Weapons`)
      .pipe(finalize(() => this.isLoadingWeapons.set(false)))
      .subscribe({
        next: weapons => this.weapons.set(weapons),
        error: () => {
          this.weapons.set([]);
          this.message.set('Failed to load weapons list.');
          this.isError.set(true);
        }
      });
  }

  createHero(): void {
    const heroName = this.heroNameControl.value?.trim() ?? '';
    const selectedWeaponId = this.weaponControl.value;

    if (!heroName) {
      this.message.set('Hero name is required.');
      this.isError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    this.message.set(null);
    this.isError.set(false);

    this.httpClient
      .post(`${this.apiBaseUrl}/api/Hero`, { name: heroName }, { responseType: 'text' })
      .pipe(
        switchMap(() => {
          if (selectedWeaponId === null) {
            return of('Hero created successfully.');
          }

          return this.httpClient
            .get<HeroModel[]>(
              `${this.apiBaseUrl}/api/Hero/Heroes?pageIndex=0&search=${encodeURIComponent(heroName)}`
            )
            .pipe(
              map(heroes => {
                const heroId =
                  heroes
                    .filter(x => (x.name ?? '').trim().toLowerCase() === heroName.toLowerCase())
                    .sort((a, b) => b.id - a.id)[0]?.id ?? null;

                if (heroId === null) {
                  throw new Error('Hero created, but failed to resolve hero id for weapon assignment.');
                }

                return heroId;
              }),
              switchMap(heroId =>
                this.httpClient.post(`${this.apiBaseUrl}/api/Hero/${heroId}/${selectedWeaponId}`, null, {
                  responseType: 'text'
                })
              ),
              map(() => 'Hero created and weapon assigned successfully.')
            );
        }),
        catchError(err => {
          const errorMessage =
            typeof err?.error === 'string' ? err.error : (err?.message ?? 'Failed to create hero.');
          this.message.set(errorMessage);
          this.isError.set(true);
          return of(null);
        }),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe(resultMessage => {
        if (!resultMessage) {
          return;
        }

        this.message.set(resultMessage);
        this.isError.set(false);
        this.heroNameControl.setValue('');
        this.weaponControl.setValue(null);
      });
  }
}
