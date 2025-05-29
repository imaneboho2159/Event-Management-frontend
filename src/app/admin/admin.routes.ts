import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        title: 'Users Management'
      },
      {
        path: 'events',
        component: EventsComponent,
        title: 'Events Management'
      },
      {
        path: 'reservations',
        component: ReservationsComponent,
        title: 'Reservations Management'
      },
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
      }
    ]
  }
]; 