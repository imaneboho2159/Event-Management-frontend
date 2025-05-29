import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
  category?: string;
  price?: number;
  capacity?: number;
  organizer?: string;
}

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <mat-card class="event-card">
      <!-- Event Image -->
      <div class="relative">
        <img [src]="event.imageUrl || 'assets/images/event-placeholder.jpg'"
             [alt]="event.name"
             class="h-48 w-full object-cover rounded-t-xl">
        
        <div class="absolute top-4 right-4">
          <mat-chip-set>
            <mat-chip class="bg-white/90 text-[#6C63FF] text-sm">
              {{ event.category || 'Event' }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Event Details -->
      <mat-card-content class="p-6">
        <h3 class="text-xl font-bold mb-2 bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
          {{ event.name }}
        </h3>

        <div class="space-y-3">
          <!-- Date & Time -->
          <div class="flex items-center text-gray-600">
            <mat-icon class="text-[#6C63FF] mr-2">calendar_today</mat-icon>
            <span>{{ event.date | date:'medium' }}</span>
          </div>

          <!-- Location -->
          <div class="flex items-center text-gray-600">
            <mat-icon class="text-[#6C63FF] mr-2">location_on</mat-icon>
            <span>{{ event.location }}</span>
          </div>

          <!-- Price -->
          <div *ngIf="event.price !== undefined" class="flex items-center text-gray-600">
            <mat-icon class="text-[#6C63FF] mr-2">attach_money</mat-icon>
            <span>{{ event.price === 0 ? 'Free' : (event.price | currency) }}</span>
          </div>

          <!-- Capacity -->
          <div *ngIf="event.capacity" class="flex items-center text-gray-600">
            <mat-icon class="text-[#6C63FF] mr-2">group</mat-icon>
            <span>{{ event.capacity }} spots</span>
          </div>

          <!-- Description -->
          <p class="text-gray-600 mt-4 line-clamp-2">{{ event.description }}</p>
        </div>
      </mat-card-content>

      <!-- Actions -->
      <mat-card-actions class="p-6 pt-0 flex justify-between items-center">
        <span class="text-sm text-gray-500" *ngIf="event.organizer">
          By {{ event.organizer }}
        </span>
        <a mat-flat-button 
           [routerLink]="['/events', event.id]"
           class="bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-white px-6 
                  rounded-full hover:opacity-90 transition-all duration-300">
          View Details
        </a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .event-card {
      @apply bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full;
      
      &:hover {
        transform: translateY(-4px);
      }
    }

    ::ng-deep {
      .mat-mdc-card {
        --mdc-elevated-card-container-color: transparent;
      }

      .mat-mdc-chip {
        font-weight: 500;
      }
    }
  `]
})
export class EventCardComponent {
  @Input() event!: Event;
} 