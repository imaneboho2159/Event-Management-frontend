import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar class="bg-transparent px-6 py-4">
      <span class="text-2xl font-bold text-white">Event Management</span>
      <div class="flex-grow"></div>
      <nav>
        <a mat-button routerLink="/admin/events" routerLinkActive="active"
           class="text-white hover:bg-white/10 transition-colors">
          <mat-icon>event</mat-icon>
          Events
        </a>
        <a mat-button routerLink="/admin/users" routerLinkActive="active"
           class="text-white hover:bg-white/10 transition-colors">
          <mat-icon>people</mat-icon>
          Users
        </a>
        <a mat-button routerLink="/admin/reservations" routerLinkActive="active"
           class="text-white hover:bg-white/10 transition-colors">
          <mat-icon>book_online</mat-icon>
          Reservations
        </a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    :host {
      display: block;
    }

    .flex-grow {
      flex: 1 1 auto;
    }

    nav {
      display: flex;
      gap: 1rem;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    mat-icon {
      margin-right: 0.5rem;
    }

    ::ng-deep {
      .mat-mdc-button {
        border-radius: 9999px !important;
        padding: 0.5rem 1.5rem;
      }
    }
  `]
})
export class AdminNavComponent {} 