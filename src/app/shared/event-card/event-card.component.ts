import { Component } from '@angular/core';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-event-card',
  imports: [
    MatCard
  ],
  template: `
    <mat-card class="dashboard-card">
      <h1>Tableau de bord</h1>
      <p>Bienvenue dans l'interface d'administration.</p>
    </mat-card>
  `,
  styles: [`
    .dashboard-card {
      margin: 2rem;
      padding: 1rem;
    }
  `]
})
export class EventCardComponent {

}
