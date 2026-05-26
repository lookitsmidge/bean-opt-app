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
    }

];