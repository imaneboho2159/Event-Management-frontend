import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="bg-white shadow-md">
      <div class="container mx-auto px-4 flex items-center justify-between h-16">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
            EventHub
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <a routerLink="/" 
             routerLinkActive="text-[#6C63FF]" 
             [routerLinkActiveOptions]="{exact: true}"
             class="nav-link">
            Home
          </a>
          <a routerLink="/events" 
             routerLinkActive="text-[#6C63FF]"
             class="nav-link">
            Events
          </a>
          <a routerLink="/about" 
             routerLinkActive="text-[#6C63FF]"
             class="nav-link">
            About
          </a>

          <!-- Auth Buttons -->
          <ng-container *ngIf="!(authService.user$ | async); else userMenu">
            <a routerLink="/login"
               class="bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-white px-6 py-2 rounded-full
                      hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
              Sign In
            </a>
          </ng-container>

          <ng-template #userMenu>
            <button mat-button [matMenuTriggerFor]="menu" 
                    class="flex items-center space-x-1 text-gray-700 hover:text-[#6C63FF] transition-colors">
              <mat-icon>account_circle</mat-icon>
              <span>{{ (authService.user$ | async)?.email }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #menu="matMenu" class="mt-2">
              <a mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </a>
              <a mat-menu-item routerLink="/my-events">
                <mat-icon>event</mat-icon>
                <span>My Events</span>
              </a>
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-template>
        </nav>

        <!-- Mobile Menu Button -->
        <button mat-icon-button 
                class="md:hidden"
                (click)="toggleMobileMenu()">
          <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <!-- Mobile Menu -->
    <div *ngIf="isMobileMenuOpen" 
         class="md:hidden fixed inset-0 z-50 bg-white pt-16">
      <nav class="container mx-auto px-4 py-4 space-y-4">
        <a routerLink="/" 
           (click)="toggleMobileMenu()"
           class="mobile-nav-link">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        <a routerLink="/events" 
           (click)="toggleMobileMenu()"
           class="mobile-nav-link">
          <mat-icon>event</mat-icon>
          <span>Events</span>
        </a>
        <a routerLink="/about" 
           (click)="toggleMobileMenu()"
           class="mobile-nav-link">
          <mat-icon>info</mat-icon>
          <span>About</span>
        </a>

        <div class="pt-4 border-t border-gray-100">
          <ng-container *ngIf="!(authService.user$ | async); else mobileuserMenu">
            <a routerLink="/login" 
               (click)="toggleMobileMenu()"
               class="mobile-nav-link bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-white">
              <mat-icon>login</mat-icon>
              <span>Sign In</span>
            </a>
          </ng-container>

          <ng-template #mobileuserMenu>
            <a routerLink="/profile" 
               (click)="toggleMobileMenu()"
               class="mobile-nav-link">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </a>
            <a routerLink="/my-events" 
               (click)="toggleMobileMenu()"
               class="mobile-nav-link">
              <mat-icon>event</mat-icon>
              <span>My Events</span>
            </a>
            <button (click)="logout(); toggleMobileMenu()" 
                    class="mobile-nav-link text-red-500 w-full text-left">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </ng-template>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-link {
      @apply text-gray-700 hover:text-[#6C63FF] transition-colors duration-300 font-medium;
    }

    .mobile-nav-link {
      @apply flex items-center space-x-4 p-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300;
    }

    ::ng-deep {
      .mat-mdc-menu-panel {
        @apply rounded-xl;
      }

      .mat-mdc-menu-item {
        @apply rounded-lg mx-1 my-1;

        .mat-icon {
          @apply mr-4;
        }
      }
    }
  `]
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }
} 