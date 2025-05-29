import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Event' : 'Create Event' }}</h2>
      
      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Title Field -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter event title">
          <mat-error *ngIf="eventForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
        </mat-form-field>

        <!-- Description Field -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter event description" rows="4"></textarea>
          <mat-error *ngIf="eventForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
        </mat-form-field>

        <!-- Date Field -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="eventForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>

        <!-- Location Field -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" placeholder="Enter event location">
          <mat-error *ngIf="eventForm.get('location')?.hasError('required')">
            Location is required
          </mat-error>
        </mat-form-field>

        <!-- Available Seats Field -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Available Seats</mat-label>
          <input matInput type="number" formControlName="availableSeats" placeholder="Enter number of available seats">
          <mat-error *ngIf="eventForm.get('availableSeats')?.hasError('required')">
            Available seats is required
          </mat-error>
          <mat-error *ngIf="eventForm.get('availableSeats')?.hasError('min')">
            Available seats must be greater than 0
          </mat-error>
        </mat-form-field>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-4">
          <button mat-button type="button" (click)="dialogRef.close()">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="eventForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class EventFormDialogComponent {
  eventForm!: FormGroup;
  isEditMode: boolean;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.id;
    this.initForm();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      title: [this.data.title || '', Validators.required],
      description: [this.data.description || '', Validators.required],
      date: [this.data.date ? new Date(this.data.date) : null, Validators.required],
      location: [this.data.location || '', Validators.required],
      availableSeats: [this.data.availableSeats || '', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      const eventData = {
        ...this.eventForm.value,
        date: this.eventForm.value.date.toISOString()
      };

      const request = this.isEditMode
        ? this.eventService.updateEvent(this.data.id, eventData)
        : this.eventService.createEvent(eventData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Event ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} event`,
            'Close',
            { duration: 3000 }
          );
          this.isSubmitting = false;
        }
      });
    }
  }
} 