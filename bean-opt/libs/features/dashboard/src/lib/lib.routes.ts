import { Routes } from '@angular/router';
import { HomeComponent } from './home/home'
import { DashboardComponent } from './dashboard/dashboard';


export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: []// Add Auth Guard here
  }

];
