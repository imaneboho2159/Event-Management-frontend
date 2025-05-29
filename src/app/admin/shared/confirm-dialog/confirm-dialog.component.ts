import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">{{data.title}}</h2>
      <p class="text-gray-600 mb-6">{{data.message}}</p>
      
      <div class="flex justify-end gap-4">
        <button mat-button (click)="dialogRef.close(false)">
          Cancel
        </button>
        <button mat-raised-button 
                color="warn" 
                (click)="dialogRef.close(true)">
          Confirm
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
} 