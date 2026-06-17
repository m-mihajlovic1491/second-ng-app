import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, finalize, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

interface BulkHealCombatantsResult {
  heroesHealed: number;
  monstersHealed: number;
}

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
        [opened]="showAuthenticatedShell() && !isHandset()"
      >
        @if (showAuthenticatedShell()) {
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
        }
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="app-toolbar" color="primary">
          @if (showAuthenticatedShell()) {
          @if (isHandset()) {
          <button mat-icon-button type="button" (click)="drawer.toggle()" aria-label="Open navigation menu">
            <mat-icon>menu</mat-icon>
          </button>
          }
          <span class="toolbar-title">Realm Command</span>
          <span class="toolbar-spacer"></span>
          @if (bulkHealMessage()) {
          <span class="toolbar-message" [class.error]="bulkHealIsError()">
            {{ bulkHealMessage() }}
          </span>
          }
          <button
            mat-flat-button
            class="bulk-heal-button"
            type="button"
            [disabled]="isHealingCombatants()"
            (click)="healAllCombatants()"
            aria-label="Heal all heroes and monsters"
          >
            <mat-icon>healing</mat-icon>
            {{ isHealingCombatants() ? 'Healing...' : 'Heal All' }}
          </button>
          <button mat-button type="button" (click)="logout()">Logout</button>
          } @else {
          <span class="toolbar-title">Realm Command</span>
          <span class="toolbar-spacer"></span>
          <a mat-button routerLink="/login">Login</a>
          <a mat-flat-button routerLink="/register">Register</a>
          }
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

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .toolbar-message {
        color: var(--realm-parchment-light);
        font-size: 0.85rem;
        font-weight: 600;
        margin: 0 0.85rem;
      }

      .toolbar-message.error {
        color: #ffd6cf;
      }

      .bulk-heal-button mat-icon {
        margin-right: 0.35rem;
      }

      .page-shell {
        padding: clamp(1rem, 3vw, 2rem);
      }

      .page-content {
        max-width: 1200px;
        margin: 0 auto;
      }

      @media (max-width: 720px) {
        .toolbar-message {
          display: none;
        }
      }
    `,
  ],
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly apiBaseUrl =
    (globalThis as { __strategyGameApiBaseUrl?: string }).__strategyGameApiBaseUrl ??
    'https://localhost:7098';

  readonly currentUrl = signal(this.router.url);
  readonly showAuthenticatedShell = computed(
    () => this.authService.isAuthenticated() && !this.isPublicRoute(this.currentUrl()),
  );
  readonly isHealingCombatants = signal(false);
  readonly bulkHealMessage = signal<string | null>(null);
  readonly bulkHealIsError = signal(false);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 960px)').pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  closeDrawerOnMobile(drawer: MatSidenav): void {
    if (this.isHandset()) {
      drawer.close();
    }
  }

  healAllCombatants(): void {
    if (this.isHealingCombatants()) {
      return;
    }

    this.isHealingCombatants.set(true);
    this.bulkHealMessage.set(null);
    this.bulkHealIsError.set(false);

    this.httpClient
      .patch<BulkHealCombatantsResult>(`${this.apiBaseUrl}/api/combatants/bulkheal`, null)
      .pipe(finalize(() => this.isHealingCombatants.set(false)))
      .subscribe({
        next: (result) => {
          this.bulkHealMessage.set(
            `Healed ${result.heroesHealed} heroes and ${result.monstersHealed} monsters.`,
          );
          this.refreshCurrentPage();
        },
        error: (err) => {
          const errorMessage =
            typeof err?.error === 'string' ? err.error : 'Failed to heal combatants.';
          this.bulkHealMessage.set(errorMessage);
          this.bulkHealIsError.set(true);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  private refreshCurrentPage(): void {
    const currentUrl = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  private isPublicRoute(url: string): boolean {
    const publicPath = url.split('?')[0];
    return publicPath === '/' || publicPath === '/login' || publicPath === '/register';
  }
}
