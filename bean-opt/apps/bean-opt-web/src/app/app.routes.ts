import { Route } from '@angular/router';
import { IsAuthenticatedAuthGuard } from '@boa/core-auth-data-access';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path:'auth',
        loadChildren: () => import('@boa/core-auth-feature').then(x => x.GLOBAL_PROFILE_ROUTES)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('@boa/features-dashboard').then(x => x.HOME_ROUTES)
    },
    {
        path: 'readings',
        canActivate: [IsAuthenticatedAuthGuard],
        loadChildren: () => import('@boa/features/readings/feature').then(x => x.READINGS_ROUTES)
    },
    {
        path: 'beans',
        canActivate: [IsAuthenticatedAuthGuard],
        loadChildren: () => import('@boa/features/coffees/feature').then(x => x.BEANS_ROUTES)
    },
    {
        path: 'equipment',
        canActivate: [IsAuthenticatedAuthGuard],
        loadChildren: () => import('@boa/features/equipment/feature').then(x => x.EQUIPMENT_ROUTES)
    }
];