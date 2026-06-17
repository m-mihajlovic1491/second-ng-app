import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <mat-card class="page-card form-card account-form-card">
      <mat-card-header>
        <mat-card-title>Register</mat-card-title>
        <mat-card-subtitle>Create your realm command account.</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="form-grid account-form-grid">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" autocomplete="email" [formControl]="emailControl" />
            @if (emailControl.touched && emailControl.hasError('required')) {
              <mat-error>Email is required.</mat-error>
            } @else if (emailControl.touched && emailControl.hasError('email')) {
              <mat-error>Enter a valid email address.</mat-error>
            }
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              autocomplete="new-password"
              [formControl]="passwordControl"
              (keyup.enter)="register()"
            />
            @if (passwordControl.touched && passwordControl.hasError('required')) {
              <mat-error>Password is required.</mat-error>
            } @else if (passwordControl.touched && passwordControl.hasError('minlength')) {
              <mat-error>Password must be at least 6 characters long.</mat-error>
            }
          </mat-form-field>
        </div>
      </mat-card-content>

      <mat-card-actions class="actions-row">
        <a mat-button routerLink="/login">Already registered?</a>
        <button
          mat-flat-button
          color="primary"
          type="button"
          [disabled]="isSubmitting()"
          (click)="register()"
        >
          {{ isSubmitting() ? 'Registering...' : 'Register' }}
        </button>
      </mat-card-actions>

      @if (message()) {
        <div class="message" [class.error]="isError()">
          {{ message() }}
        </div>
      }
    </mat-card>
  `,
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });
  readonly isSubmitting = signal(false);
  readonly message = signal<string | null>(null);
  readonly isError = signal(false);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/users');
    }
  }

  register(): void {
    this.emailControl.markAsTouched();
    this.passwordControl.markAsTouched();

    if (this.emailControl.invalid || this.passwordControl.invalid) {
      this.message.set('Enter a valid email and a password with at least 6 characters.');
      this.isError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    this.message.set(null);
    this.isError.set(false);

    this.authService
      .register(this.emailControl.value.trim(), this.passwordControl.value)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/users'),
        error: (err) => {
          this.message.set(this.authService.getErrorMessage(err, 'Failed to register.'));
          this.isError.set(true);
        },
      });
  }
}
