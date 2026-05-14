import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-monster-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './create-monster-form.html',
  styleUrl: './create-monster-form.scss'
})
export class CreateMonsterForm {
  private httpClient = inject(HttpClient);

  nameControl = new FormControl('');
  damageControl = new FormControl('');
  defenseControl = new FormControl('');
  message = signal<string | null>(null);

  createMonster() {
    const name = this.nameControl.value?.trim() ?? '';
    const damage = Number(this.damageControl.value);
    const defense = Number(this.defenseControl.value);

    const payload = {
      name,
      damage,
      defense
    };

    this.httpClient.post('https://localhost:7098/api/Monster', payload, { responseType: 'text' }).subscribe({
      next: () => {
        this.message.set('Monster created successfully.');
      },
      error: err => {
        this.message.set(err?.error ? JSON.stringify(err.error) : 'Failed to create monster.');
      }
    });
  }
}
