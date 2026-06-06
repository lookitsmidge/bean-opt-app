import { Routes } from '@angular/router';
import { ReadingsListComponent } from './readings-list/readings-list.component';
import { NewReadingComponent } from './new-reading/new-reading.component';

export const READINGS_ROUTES: Routes = [
  {
    path: '',
    component: ReadingsListComponent,
  },
  {
    path: 'new',
    component: NewReadingComponent,
  },
  {
    path: 'edit/:id',
    component: NewReadingComponent,
  },
];
