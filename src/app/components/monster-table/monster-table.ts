import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MonsterModel } from '../../models/MonsterModel';

@Component({
  selector: 'app-monster-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './monster-table.html',
  styleUrl: './monster-table.scss'
})
export class MonsterTableComponent implements OnInit {
  private http = inject(HttpClient);

  formControl = new FormControl('');
  monsters = signal<MonsterModel[]>([]);
  displayedColumns: string[] = ['id', 'name', 'damage', 'defense', 'health'];

  ngOnInit(): void {
    this.loadAllMonsters();
  }

  onSearch() {
    const search = this.formControl.value?.trim() ?? '';
    this.http
      .get<MonsterModel[]>(
        `https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10&search=${encodeURIComponent(search)}`
      )
      .subscribe(res => this.monsters.set(res));
  }

  loadAllMonsters() {
    this.http
      .get<MonsterModel[]>('https://localhost:7098/api/Monster/Monsters?pageIndex=0&pageSize=10')
      .subscribe(res => this.monsters.set(res));
  }
}
