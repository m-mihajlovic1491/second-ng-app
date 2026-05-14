import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-battle-audit-log',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  template: `
    <section class="page-card">
      <h1 class="section-title">Battle Logs</h1>
      <p class="section-subtitle">Latest battle outcomes fetched from the battle results service.</p>

      <div class="table-shell">
        <div class="table-scroll">
          <table mat-table [dataSource]="battleLogs()" class="battle-logs-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let log">{{ log.id }}</td>
            </ng-container>

            <ng-container matColumnDef="occurredAtUtc">
              <th mat-header-cell *matHeaderCellDef>Occurred (UTC)</th>
              <td mat-cell *matCellDef="let log">{{ log.occurredAtUtc | date: 'medium' : 'UTC' }}</td>
            </ng-container>

            <ng-container matColumnDef="winnerName">
              <th mat-header-cell *matHeaderCellDef>Winner</th>
              <td mat-cell *matCellDef="let log">{{ log.winnerName }}</td>
            </ng-container>

            <ng-container matColumnDef="winnerRemainingHealth">
              <th mat-header-cell *matHeaderCellDef>Remaining HP</th>
              <td mat-cell *matCellDef="let log">{{ log.winnerRemainingHealth }}</td>
            </ng-container>

            <ng-container matColumnDef="loserName">
              <th mat-header-cell *matHeaderCellDef>Loser</th>
              <td mat-cell *matCellDef="let log">{{ log.loserName }}</td>
            </ng-container>

            <ng-container matColumnDef="fighters">
              <th mat-header-cell *matHeaderCellDef>Fighters</th>
              <td mat-cell *matCellDef="let log">Hero #{{ log.heroId }} vs Monster #{{ log.monsterId }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>

      @if (errorMessage()) {
        <div class="message error">{{ errorMessage() }}</div>
      }

      @if (!errorMessage() && battleLogs().length === 0) {
        <div class="message">No battle results available yet.</div>
      }
    </section>
  `,
  styleUrl: './battle-audit-log.scss'
})
export class BattleAuditLog implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly battleResultsApiBaseUrl =
    (globalThis as { __battleResultsApiBaseUrl?: string }).__battleResultsApiBaseUrl ??
    'https://localhost:7299';

  readonly displayedColumns = [
    'id',
    'occurredAtUtc',
    'winnerName',
    'winnerRemainingHealth',
    'loserName',
    'fighters'
  ];

  readonly battleLogs = signal<BattleAuditLogModel[]>([]);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.httpClient
      .get<PagedResult<BattleAuditLogModel>>(`${this.battleResultsApiBaseUrl}/battle-results?offset=0&limit=50`)
      .subscribe({
        next: res => {
          this.errorMessage.set(null);
          this.battleLogs.set(res.items);
        },
        error: () => {
          this.errorMessage.set('Failed to load battle results.');
          this.battleLogs.set([]);
        }
      });
  }
}

class BattleAuditLogModel {
  id!: number;
  occurredAtUtc!: string;
  heroId!: number;
  monsterId!: number;
  winnerName!: string;
  winnerRemainingHealth!: number;
  loserName!: string;
}

class PagedResult<T> {
  items!: T[];
  totalCount!: number;
  offset!: number;
  limit!: number;
}
