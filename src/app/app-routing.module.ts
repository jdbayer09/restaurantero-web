import { inject, NgModule } from '@angular/core';
import { CanMatchFn, RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/security/auth.service';

const AuthenticationGuard: CanMatchFn = 
  () => 
  inject(AuthService).isAuthenticated();

const NotAuthenticationGuard: CanMatchFn = 
  () => 
  inject(AuthService).isNotAuthenticated();

const routes: Routes = [
  {
    path: '',
    redirectTo: 'z',
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canMatch: [NotAuthenticationGuard]
  }, 
  { 
    path: 'z', 
    loadChildren: () => import('./pages/zone/zone.module').then(m => m.ZoneModule),
    canMatch: [AuthenticationGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'z'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
