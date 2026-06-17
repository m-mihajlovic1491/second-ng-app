import { Routes } from '@angular/router';
import { About } from './components/about/about';
import { AccountLanding } from './components/account-landing/account-landing';
import { HeroTableComponent } from './components/body/body';
import { CreateHeroForm } from './components/create-hero-form/create-hero-form';
import { BattleAuditLog } from './components/battle-audit-log/battle-audit-log';
import { BattleFormComponent } from './components/battle-form/battle-form';
import { CreateMonsterForm } from './components/create-monster-form/create-monster-form';
import { MonsterTableComponent } from './components/monster-table/monster-table';
import { CreateWeaponForm } from './components/create-weapon-form/create-weapon-form';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './services/auth.guard';


export const routes: Routes = [
    {path: '',component: AccountLanding, pathMatch :'full'},
    {path: 'login',component: Login},
    {path: 'register',component: Register},
    {path: 'about',component: About, canActivate: [authGuard]},
    {path: 'users',component: HeroTableComponent, canActivate: [authGuard]},
    {path: 'create-hero',component: CreateHeroForm, canActivate: [authGuard]},
    {path: 'create-weapon',component: CreateWeaponForm, canActivate: [authGuard]},
    {path: 'monsters',component: MonsterTableComponent, canActivate: [authGuard]},
    {path: 'create-monster',component: CreateMonsterForm, canActivate: [authGuard]},
    {path: 'battle',component: BattleFormComponent, canActivate: [authGuard]},
    {path: 'battle-audit-logs',component: BattleAuditLog, canActivate: [authGuard]}
];
