import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-hero-form',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, MatButtonModule],
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
            <input matInput placeholder="Enter new hero name" [formControl]="formControl" (keyup.enter)="onSearch()">
          </mat-form-field>
        </div>
      </mat-card-content>

      <mat-card-actions class="actions-row">
        <button mat-flat-button color="primary" type="button" (click)="onSearch()">Create hero</button>
      </mat-card-actions>

      @if (errorMessage()) {
        <div class="message">
          {{ errorMessage() }}
        </div>
      }
    </mat-card>
  `,
  styleUrl: './create-hero-form.scss'
})
export class CreateHeroForm {
private httpClient = inject(HttpClient)
heroName = signal<string>('')
formControl = new FormControl('')
errorMessage = signal<string | null>(null)  
onSearch() {

  const heroName = this.formControl.value?.trim();

  const payload = {
    name: `${heroName}`
  }

  this.httpClient.post('https://localhost:7098/api/Hero',payload,{responseType: 'text'})
    .subscribe({
      next: (res: string) => {console.log('Success:', res);
      this.errorMessage.set(res);
    },
      error: (err)=> {console.error('Success:', err);
        this.errorMessage.set(err.error);
        setTimeout(()=>this.errorMessage.set(null),3000)
      }
    });
}

}
