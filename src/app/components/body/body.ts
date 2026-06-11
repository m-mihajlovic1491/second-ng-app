import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { HeroModel } from '../../models/HeroModel';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'user-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatFormFieldModule, MatLabel, ReactiveFormsModule,MatInputModule],
  styleUrl:'./body.scss',
  template: `
    <section class="page-card">
      <h2 class="section-title">All Heroes</h2>

      <mat-form-field class="search-field">
        <mat-label>Search</mat-label>
        <input matInput placeholder="Search Hero" [formControl]="formControl" (keyup.enter)="onSearch()">
      </mat-form-field>

      <div class="table-shell">
        <div class="table-scroll">
          <table mat-table [dataSource]="hero()" class="heroes-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let hero"> {{ hero.id }} </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Name </th>
              <td mat-cell *matCellDef="let hero"> {{ hero.name }} </td>
            </ng-container>

            <ng-container matColumnDef="health">
              <th mat-header-cell *matHeaderCellDef> Health </th>
              <td mat-cell *matCellDef="let hero"><span class="stat-badge">{{ hero.health }}</span></td>
            </ng-container>

            <ng-container matColumnDef="equippedWeapon">
              <th mat-header-cell *matHeaderCellDef> Weapon </th>
              <td mat-cell *matCellDef="let hero"> {{ formatValue(hero.equippedWeapon?.name) }} </td>
            </ng-container>

            <ng-container matColumnDef="equippedArmor">
              <th mat-header-cell *matHeaderCellDef> Armor </th>
              <td mat-cell *matCellDef="let hero"> {{ formatValue(hero.equippedArmor?.name) }} </td>
            </ng-container>

            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let hero">
                <button mat-icon-button (click)="handleDeleteHero(hero.id)" aria-label="Delete hero">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row class="entity-hero" *matRowDef="let hero; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </section>
  `
})
export class HeroTableComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl =
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl ??
    'https://localhost:7098';

  formControl = new FormControl('');

  hero = signal<HeroModel[]>([]);

  displayedColumns: string[] = ['id', 'name', 'health', 'equippedWeapon', 'equippedArmor', 'action'];

  ngOnInit(): void {
    this.loadAllHeroes();
  }
  
  onSearch() {
    const search = this.formControl.value?.trim();
    this.http.get<HeroModel[]>(
      `${this.apiBaseUrl}/api/Hero/Heroes?pageIndex=0&pageSize=1000&search=${search}`
    )
      .subscribe(res => this.hero.set(res));
  }

  loadAllHeroes() {
    this.http.get<HeroModel[]>(`${this.apiBaseUrl}/api/Hero/Heroes?pageIndex=0&pageSize=1000`)
      .subscribe(res => this.hero.set(res));
  }

  handleDeleteHero(id: number): void {
    this.http.delete(`${this.apiBaseUrl}/api/Hero/${id}`)
      .subscribe({
        next: () => {
          this.loadAllHeroes();
          console.log(`hero with id ${id} deleted successfully`);
        },
        error: err => console.error('Delete failed:', err)
      });
  }

  formatValue(value: string | null | undefined, fallback = 'NO') {
    return value ?? fallback;
  }
}
