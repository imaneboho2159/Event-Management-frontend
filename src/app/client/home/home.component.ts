import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventCardComponent, Event } from '../../shared/event-card/event-card.component';
import { EventService } from '../../services/event.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, startWith, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    EventCardComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
          Discover Amazing Events
        </h1>
        <p class="text-gray-600 text-lg">
          Find and join the most exciting events in your area
        </p>
      </div>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative flex items-center">
          <div class="relative w-full">
            <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="searchQueryChanged($event)"
              placeholder="Search events..."
              class="w-full py-3 px-12 bg-[#F8F9FA] border border-[#E2E8F0] rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] focus:ring-opacity-50"
            >
            <span class="absolute left-4 top-1/2 -translate-y-1/2">
              <mat-icon class="text-gray-400">search</mat-icon>
            </span>
            <button 
              *ngIf="searchQuery"
              (click)="searchQuery = ''; searchQueryChanged('')"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-600">Loading events...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- Events Grid -->
      <div *ngIf="!loading && !error" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let event of events" class="h-full">
          <app-event-card [event]="event"></app-event-card>
        </div>

        <!-- No Results -->
        <div *ngIf="events.length === 0" class="col-span-full text-center py-12">
          <p class="text-gray-600">No events found matching your search.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f8fafc;
    }

    mat-form-field {
      ::ng-deep {
        .mat-mdc-form-field-flex {
          background-color: white;
          border-radius: 9999px !important;
        }

        .mat-mdc-text-field-wrapper {
          background-color: white;
          border-radius: 9999px !important;
        }

        .mdc-notched-outline__leading {
          border-radius: 9999px 0 0 9999px !important;
        }

        .mdc-notched-outline__trailing {
          border-radius: 0 9999px 9999px 0 !important;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(private eventService: EventService) {
    this.searchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query): Observable<Event[]> => {
        this.loading = true;
        return query ? this.eventService.searchEvents(query) : this.eventService.getAllEvents();
      })
    ).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load events. Please try again later.';
        console.error('Error loading events:', err);
      }
    });
  }

  ngOnInit(): void {
    // Initial load of events is handled by the searchSubject's startWith('')
  }

  searchQueryChanged(query: string): void {
    this.searchSubject.next(query);
  }
} 