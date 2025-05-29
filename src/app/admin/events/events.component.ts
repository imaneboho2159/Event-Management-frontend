import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventFormDialogComponent } from '../events/event-form-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { EventService } from '../../services/event.service';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  availableSeats: number;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
          Events Management
        </h1>
        <button mat-raised-button 
                (click)="openEventDialog()"
                class="bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-white px-6 py-2 rounded-full
                       hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
          <mat-icon class="mr-2">add</mat-icon>
          Create Event
        </button>
      </div>

      <div class="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="events" class="w-full">
            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Title</th>
              <td mat-cell *matCellDef="let event">{{event.title}}</td>
            </ng-container>

            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Description</th>
              <td mat-cell *matCellDef="let event" class="max-w-xs truncate">{{event.description}}</td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Date</th>
              <td mat-cell *matCellDef="let event">{{event.date | date:'medium'}}</td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Location</th>
              <td mat-cell *matCellDef="let event">{{event.location}}</td>
            </ng-container>

            <!-- Available Seats Column -->
            <ng-container matColumnDef="availableSeats">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Available Seats</th>
              <td mat-cell *matCellDef="let event">
                <span class="px-3 py-1 rounded-full text-sm"
                      [ngClass]="{'bg-green-100 text-green-700': event.availableSeats > 10,
                                'bg-yellow-100 text-yellow-700': event.availableSeats <= 10 && event.availableSeats > 0,
                                'bg-red-100 text-red-700': event.availableSeats === 0}">
                  {{event.availableSeats}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Actions</th>
              <td mat-cell *matCellDef="let event">
                <button mat-icon-button 
                        class="text-[#6C63FF] hover:text-[#B06AB3] transition-colors"
                        (click)="editEvent(event)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button 
                        class="text-red-500 hover:text-red-700 transition-colors"
                        (click)="deleteEvent(event)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                class="hover:bg-gray-50 transition-colors"></tr>
          </table>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading" class="flex justify-center items-center p-8">
          <mat-spinner diameter="40" class="text-[#6C63FF]"></mat-spinner>
        </div>

        <!-- No Data Message -->
        <div *ngIf="!isLoading && events.length === 0" 
             class="p-8 text-center text-gray-500">
          No events found
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    ::ng-deep {
      .mat-mdc-table {
        background: transparent;
      }

      .mdc-data-table__header-row {
        background-color: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }

      .mat-mdc-header-cell {
        color: #1e293b;
        font-size: 0.875rem;
        padding: 1rem;
      }

      .mat-mdc-cell {
        color: #475569;
        font-size: 0.875rem;
        padding: 1rem;
      }

      .mdc-data-table__row:last-child .mdc-data-table__cell {
        border-bottom: none;
      }

      .mat-mdc-raised-button {
        --mdc-protected-button-container-shape: 9999px;
      }
    }
  `]
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  displayedColumns: string[] = ['title', 'description', 'date', 'location', 'availableSeats', 'actions'];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.snackBar.open('Error loading events', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openEventDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EventFormDialogComponent, {
      width: '600px',
      data: event || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }

  editEvent(event: Event): void {
    this.openEventDialog(event);
  }

  deleteEvent(event: Event): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Event',
        message: `Are you sure you want to delete event "${event.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteEvent(event.id).subscribe({
          next: () => {
            this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
            this.loadEvents();
          },
          error: (error: any) => {
            this.snackBar.open('Error deleting event', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
