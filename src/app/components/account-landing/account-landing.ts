import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-landing',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterLink],
  template: `
    <mat-card class="page-card account-landing-card">
      <mat-card-header>
        <mat-card-title>Enter the Realm</mat-card-title>
        <mat-card-subtitle>Create your command account or return to your war council.</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p>
          Your heroes, monsters, battles, and chronicles are tied to your account. Sign in to
          continue managing your realm.
        </p>
      </mat-card-content>

      <mat-card-actions class="actions-row account-actions">
        <a mat-stroked-button routerLink="/login">Login</a>
        <a mat-flat-button color="primary" routerLink="/register">Register</a>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './account-landing.scss',
})
export class AccountLanding implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/users');
    }
  }
}
