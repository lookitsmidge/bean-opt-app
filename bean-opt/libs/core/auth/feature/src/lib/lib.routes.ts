import { Routes } from '@angular/router';
import { ViewProfileComponent } from './profile/view-profile.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SettingsDashboardComponent } from './settings/settings-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { IsAuthenticatedAuthGuard } from '@boa/core-auth-data-access';
import { roleGuard } from './guards/role.guard';

export const GLOBAL_PROFILE_ROUTES: Routes = [
    {
        path: '', // matches /auth
        component: AuthenticationComponent
    },
    {
        path: 'profile', // matches /auth/profile
        component: ViewProfileComponent,
        canActivate: [IsAuthenticatedAuthGuard]
    },
    {
        path: 'settings', // matches /auth/settings
        component: SettingsDashboardComponent,
        canActivate: [IsAuthenticatedAuthGuard],
        data: { showHeader: false }
    },
    {
        path: 'manage-users', // matches /auth/manage-users
        component: UserManagementComponent,
        canActivate: [IsAuthenticatedAuthGuard, roleGuard('admin')],
        data: { 
            pageTitle: 'User Governance', 
            showHeader: false
        }
    }
]
