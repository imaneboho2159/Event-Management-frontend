import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationService } from '../../services/reservation.service';

interface Reservation {
  id: number;
  userId: number;
  eventId: number;
  reservationDate: string;
  numberOfSeats: number;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
          Reservations Management
        </h1>
      </div>

      <div class="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="reservations" class="w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="font-bold">ID</th>
              <td mat-cell *matCellDef="let reservation">{{reservation.id}}</td>
            </ng-container>

            <!-- User ID Column -->
            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef class="font-bold">User ID</th>
              <td mat-cell *matCellDef="let reservation">{{reservation.userId}}</td>
            </ng-container>

            <!-- Event ID Column -->
            <ng-container matColumnDef="eventId">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Event ID</th>
              <td mat-cell *matCellDef="let reservation">{{reservation.eventId}}</td>
            </ng-container>

            <!-- Reservation Date Column -->
            <ng-container matColumnDef="reservationDate">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Reservation Date</th>
              <td mat-cell *matCellDef="let reservation">{{reservation.reservationDate | date:'mediumDate'}}</td>
            </ng-container>

            <!-- Number of Seats Column -->
            <ng-container matColumnDef="numberOfSeats">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Number of Seats</th>
              <td mat-cell *matCellDef="let reservation">
                <span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                  {{reservation.numberOfSeats}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Actions</th>
              <td mat-cell *matCellDef="let reservation">
                <button mat-icon-button 
                        class="text-[#6C63FF] hover:text-[#B06AB3] transition-colors"
                        (click)="viewDetails(reservation)">
                  <mat-icon>visibility</mat-icon>
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
        <div *ngIf="!isLoading && reservations.length === 0" 
             class="p-8 text-center text-gray-500">
          No reservations found
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
    }
  `]
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  displayedColumns: string[] = ['id', 'userId', 'eventId', 'reservationDate', 'numberOfSeats', 'actions'];
  isLoading = true;

  constructor(
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading reservations', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  viewDetails(reservation: Reservation): void {
    this.snackBar.open('Viewing reservation details', 'Close', { duration: 3000 });
  }
}
