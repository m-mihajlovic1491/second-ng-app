import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleAuditLog } from './battle-audit-log';

describe('BattleAuditLog', () => {
  let component: BattleAuditLog;
  let fixture: ComponentFixture<BattleAuditLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleAuditLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleAuditLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
