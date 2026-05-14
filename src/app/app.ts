import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="app-shell">
      <mat-sidenav
        #drawer
        class="app-drawer"
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
      >
        <div class="drawer-header">
          <h2>Strategy Hub</h2>
          <p>Command your roster</p>
        </div>

        <mat-divider />

        <nav class="drawer-nav">
          <a mat-button routerLink="/users" routerLinkActive="active-link" (click)="closeDrawerOnMobile(drawer)"
            >All Heroes</a
          >
          <a
            mat-button
            routerLink="/create-hero"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            >Create Hero</a
          >
          <a
            mat-button
            routerLink="/create-weapon"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            >Create Weapon</a
          >
          <a
            mat-button
            routerLink="/monsters"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            >All Monsters</a
          >
          <a
            mat-button
            routerLink="/create-monster"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            >Create Monster</a
          >
          <a
            mat-button
            routerLink="/battle-audit-logs"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            >Battle Logs</a
          >
          <a mat-button routerLink="/about" routerLinkActive="active-link" (click)="closeDrawerOnMobile(drawer)"
            >About</a
          >
        </nav>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="app-toolbar" color="primary">
          @if (isHandset()) {
          <button mat-icon-button type="button" (click)="drawer.toggle()" aria-label="Open navigation menu">
            <mat-icon>menu</mat-icon>
          </button>
          }
          <span class="toolbar-title">Strategy Game Control Panel</span>
        </mat-toolbar>

        <main class="page-shell">
          <section class="page-content">
            <router-outlet />
          </section>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
      }

      .app-drawer {
        width: 248px;
        border-right: 1px solid color-mix(in srgb, var(--mat-sys-outline-variant) 80%, transparent);
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--mat-sys-surface-container-high) 90%, #0c1018) 0%,
          color-mix(in srgb, var(--mat-sys-surface-container) 88%, #0f141f) 100%
        );
        padding: 1rem 0.75rem;
      }

      .drawer-header {
        padding: 0.25rem 0.75rem 1rem;
      }

      .drawer-header h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .drawer-header p {
        margin: 0.35rem 0 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.85rem;
      }

      .drawer-nav {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding-top: 0.8rem;
      }

      .drawer-nav a {
        justify-content: flex-start;
        width: 100%;
        border-radius: 999px;
        letter-spacing: 0.01em;
      }

      .drawer-nav a.active-link {
        background: color-mix(in srgb, var(--mat-sys-primary) 22%, transparent);
      }

      .app-toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid color-mix(in srgb, var(--mat-sys-outline-variant) 60%, transparent);
      }

      .toolbar-title {
        margin-left: 0.5rem;
        font-weight: 600;
        letter-spacing: 0.015em;
      }

      .page-shell {
        padding: clamp(1rem, 3vw, 2rem);
      }

      .page-content {
        max-width: 1200px;
        margin: 0 auto;
      }
    `,
  ],
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 960px)').pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  closeDrawerOnMobile(drawer: MatSidenav): void {
    if (this.isHandset()) {
      drawer.close();
    }
  }
}
