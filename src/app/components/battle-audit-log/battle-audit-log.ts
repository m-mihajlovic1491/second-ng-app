import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
//import { BattleAuditLogModel } from '../../models/BattleAuditLogModel';

@Component({
  selector: 'app-battle-audit-log',
  imports: [CommonModule, MatTableModule,MatIconModule],
  template: `
  <h1>Battle Logs</h1>

  <table 
     mat-table [dataSource]="BattleLogs()" class="mat-elevation-z8" >

      
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let log"> {{ log.id }} </td>
      </ng-container>
      
      <ng-container matColumnDef="battleLog">
        <th mat-header-cell *matHeaderCellDef> Battle Log </th>
        <td mat-cell *matCellDef="let log"> {{ log.battleLog }} </td>
      </ng-container>      

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let hero; columns: displayedColumns;"></tr>
    </table>


  `,
  styleUrl: './battle-audit-log.scss'
})
export class BattleAuditLog implements OnInit  { 

  displayedColumns = ['id','battleLog']

  private httpClient = inject(HttpClient)
  BattleLogs = signal<BattleAuditLogModel[]>([])

  ngOnInit(): void {
    this.httpClient.get<BattleAuditLogModel[]>('https://localhost:7098/api/Hero/BattleLogs')
      .subscribe(res => this.BattleLogs.set(res));
  }

}

class BattleAuditLogModel {
    id!: string;
    battleLog! : string;
}
