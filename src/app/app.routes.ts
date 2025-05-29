import { Routes } from '@angular/router';
import { EventCardComponent } from './shared/event-card/event-card.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ADMIN_ROUTES } from './admin/admin.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/admin/events',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    ...ADMIN_ROUTES
];
