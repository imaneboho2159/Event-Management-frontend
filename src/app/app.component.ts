import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventCardComponent} from './shared/event-card/event-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Event-Management-frontend';
}
