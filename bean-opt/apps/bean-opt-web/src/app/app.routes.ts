import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadChildren: () => import('@boa/features-dashboard').then(x => x.HOME_ROUTES)
    },
    {
        path: 'readings',
        loadChildren: () => import('@boa/features/readings/feature').then(x => x.READINGS_ROUTES)
    }
];