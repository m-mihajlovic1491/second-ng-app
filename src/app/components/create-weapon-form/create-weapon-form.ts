import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-weapon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-weapon-form.html',
  styleUrl: './create-weapon-form.scss'
})
export class CreateWeaponForm {
  private httpClient = inject(HttpClient);

  nameControl = new FormControl('');
  damageControl = new FormControl('');
  message = signal<string | null>(null);

  createWeapon() {
    const name = this.nameControl.value?.trim() ?? '';
    const damage = Number(this.damageControl.value);

    if (!name) {
      this.message.set('Weapon name is required.');
      return;
    }

    if (!Number.isFinite(damage) || damage <= 0) {
      this.message.set('Weapon damage must be greater than 0.');
      return;
    }

    const payload = {
      name,
      damage
    };

    this.httpClient
      .post('https://localhost:7098/api/Weapon/Weapon', payload, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.message.set('Weapon created successfully.');
        },
        error: err => {
          this.message.set(err?.error ? JSON.stringify(err.error) : 'Failed to create weapon.');
        }
      });
  }
}
