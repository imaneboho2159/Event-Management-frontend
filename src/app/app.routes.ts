import { Routes } from '@angular/router';
import { EventCardComponent } from './shared/event-card/event-card.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: EventCardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
