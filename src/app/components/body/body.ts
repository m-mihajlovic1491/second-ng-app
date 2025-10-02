import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { HeroModel } from '../../models/HeroModel';

@Component({
  selector: 'user-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <h2>All Heroes</h2>

    <table 
     mat-table [dataSource]="hero()" class="mat-elevation-z8" >

      <!-- ID Column -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let hero"> {{ hero.id }} </td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Name </th>
        <td mat-cell *matCellDef="let hero"> {{ hero.name }} </td>
      </ng-container>

      <!-- Health Column -->
      <ng-container matColumnDef="health">
        <th mat-header-cell *matHeaderCellDef> Health </th>
        <td mat-cell *matCellDef="let hero"> {{ hero.health }} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let hero; columns: displayedColumns;"></tr>
    </table>
  `
})
export class HeroTableComponent implements OnInit {
  private http = inject(HttpClient);

  hero = signal<HeroModel[]>([]);

  displayedColumns: string[] = ['id', 'name', 'health'];

  ngOnInit(): void {
    this.http.get<HeroModel[]>('https://localhost:7098/api/Hero/Heroes?pageIndex=0&pageSize=10')
      .subscribe(res => this.hero.set(res));
  }
}
