import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-create-hero-form',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatFormFieldModule,ReactiveFormsModule,MatInputModule],
  template: `
  <h1>Create new hero</h1>

  <mat-form-field>
        <mat-label>Enter new hero name</mat-label>
        <input matInput placeholder="Enter new hero name" [formControl]="formControl" (keyup.enter)="onSearch()">
     </mat-form-field>

  <div *ngIf="errorMessage()" style="color: red; margin-top: 10px;">
  {{ errorMessage() }}
</div>
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
