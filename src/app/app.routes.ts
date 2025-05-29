import { Routes } from '@angular/router';
import { EventCardComponent } from './shared/event-card/event-card.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { HomeComponent } from './client/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'admin',
        children: ADMIN_ROUTES
    }
];
