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
          <h2>War Council</h2>
          <p>Summon heroes. Rally legions.</p>
        </div>

        <mat-divider />

        <nav class="drawer-nav">
          <a mat-button routerLink="/users" routerLinkActive="active-link" (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>groups</mat-icon>All Heroes</a
          >
          <a
            mat-button
            routerLink="/create-hero"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>person_add</mat-icon>Create Hero</a
          >
          <a
            mat-button
            routerLink="/create-weapon"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>construction</mat-icon>Create Weapon</a
          >
          <a
            mat-button
            routerLink="/monsters"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>pest_control</mat-icon>All Monsters</a
          >
          <a
            mat-button
            routerLink="/create-monster"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>biotech</mat-icon>Create Monster</a
          >
          <a
            mat-button
            routerLink="/battle"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>sports_martial_arts</mat-icon>Battle</a
          >
          <a
            mat-button
            routerLink="/battle-audit-logs"
            routerLinkActive="active-link"
            (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>menu_book</mat-icon>Battle Logs</a
          >
          <a mat-button routerLink="/about" routerLinkActive="active-link" (click)="closeDrawerOnMobile(drawer)"
            ><mat-icon>auto_stories</mat-icon>About</a
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
          <span class="toolbar-title">Realm Command</span>
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
        border-right: 1px solid rgba(61, 36, 21, 0.55);
        background:
          linear-gradient(180deg, rgba(255, 248, 232, 0.72) 0%, rgba(232, 213, 181, 0.88) 100%),
          var(--realm-parchment-deep);
        box-shadow: inset -1px 0 0 rgba(184, 134, 11, 0.32);
        padding: 1rem 0.75rem;
      }

      .drawer-header {
        border: 1px solid rgba(107, 68, 35, 0.42);
        border-radius: 10px;
        background: rgba(255, 248, 232, 0.58);
        padding: 0.85rem 0.75rem 1rem;
        box-shadow: inset 0 0 0 1px rgba(184, 134, 11, 0.28);
      }

      .drawer-header h2 {
        margin: 0;
        color: var(--realm-ink);
        font-family: 'Cinzel', Georgia, serif;
        font-size: 1.15rem;
        letter-spacing: 0.06em;
      }

      .drawer-header p {
        margin: 0.35rem 0 0;
        color: var(--realm-ink-muted);
        font-size: 0.85rem;
      }

      .drawer-nav {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding-top: 0.8rem;
      }

      .drawer-nav a {
        color: var(--realm-ink);
        justify-content: flex-start;
        width: 100%;
        border: 1px solid transparent;
        border-radius: 10px;
        font-weight: 600;
        letter-spacing: 0.015em;
      }

      .drawer-nav a.active-link {
        border-color: rgba(184, 134, 11, 0.5);
        background: rgba(184, 134, 11, 0.18);
        color: var(--realm-leather-dark);
        box-shadow: inset 0 0 0 1px rgba(255, 248, 232, 0.45);
      }

      .drawer-nav mat-icon {
        color: var(--realm-leather);
        margin-right: 0.65rem;
        font-size: 1.2rem;
        height: 1.2rem;
        width: 1.2rem;
      }

      .app-toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid rgba(184, 134, 11, 0.5);
        background:
          linear-gradient(90deg, var(--realm-leather-dark), var(--realm-leather) 45%, #7f5529);
        color: var(--realm-parchment-light);
        box-shadow: 0 8px 22px rgba(61, 36, 21, 0.22);
      }

      .toolbar-title {
        margin-left: 0.5rem;
        font-family: 'Cinzel', Georgia, serif;
        font-weight: 700;
        letter-spacing: 0.08em;
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
