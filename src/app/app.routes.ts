import { Routes } from '@angular/router';
import { About } from './components/about/about';
import { HeroTableComponent } from './components/body/body';
import { CreateHeroForm } from './components/create-hero-form/create-hero-form';
import { BattleAuditLog } from './components/battle-audit-log/battle-audit-log';


export const routes: Routes = [
    {path: '',component: HeroTableComponent, pathMatch :'full'},
    {path: 'about',component: About},
    {path: 'users',component: HeroTableComponent},
    {path: 'create-hero',component: CreateHeroForm},
    {path: 'battle-audit-logs',component: BattleAuditLog}
];
