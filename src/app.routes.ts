import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';

import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ContentComponent } from './components/content/content.component';

export const APP_ROUTES: Routes = [
  // Public login route
  { path: 'login', component: LoginComponent },

  // Protected area
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
      { path: 'content', component: ContentComponent, canActivate: [adminGuard] },
      { path: 'reports', component: ReportsComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
