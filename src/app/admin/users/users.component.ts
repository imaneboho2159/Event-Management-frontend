import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-users',
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
          Users Management
        </h1>
      </div>

      <div class="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="users" class="w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="font-bold">ID</th>
              <td mat-cell *matCellDef="let user">{{user.id}}</td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Email</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>

            <!-- Role Column -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Role</th>
              <td mat-cell *matCellDef="let user">
                <span class="px-3 py-1 rounded-full text-sm"
                      [ngClass]="{'bg-purple-100 text-purple-700': user.role === 'ADMIN',
                                'bg-blue-100 text-blue-700': user.role === 'USER'}">
                  {{user.role}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="font-bold">Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button 
                        class="text-[#6C63FF] hover:text-[#B06AB3] transition-colors"
                        (click)="viewUserDetails(user)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button 
                        class="text-red-500 hover:text-red-700 transition-colors"
                        (click)="deleteUser(user)">
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
        <div *ngIf="!isLoading && users.length === 0" 
             class="p-8 text-center text-gray-500">
          No users found
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
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'email', 'role', 'actions'];
  isLoading = true;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  viewUserDetails(user: User): void {
    this.userService.getUserById(user.id).subscribe({
      next: (userDetails) => {
        this.snackBar.open('User details loaded', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error loading user details', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete user ${user.email}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
