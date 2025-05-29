import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminNavComponent
  ],
  template: `
    <div class="admin-layout min-h-screen bg-gradient-to-r from-[#6C63FF] to-[#B06AB3]">
      <app-admin-nav></app-admin-nav>
      <main class="p-6">
        <div class="bg-white rounded-3xl shadow-xl p-6 max-w-7xl mx-auto transform hover:scale-[1.01] transition-all duration-300">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .admin-layout {
      min-height: 100vh;
    }

    main {
      padding-bottom: 2rem;
    }
  `]
})
export class AdminLayoutComponent {} 