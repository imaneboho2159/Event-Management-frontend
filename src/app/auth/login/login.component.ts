import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule,
    MatCheckboxModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] p-4">
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 transform hover:scale-[1.02] transition-all duration-300">
        <h1 class="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-transparent bg-clip-text">
          Login Form
        </h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Email Field -->
          <div class="form-field-wrapper">
            <mat-form-field appearance="outline" class="w-full custom-form-field">
              <input matInput 
                     type="email" 
                     formControlName="email" 
                     placeholder="Email Address">
            </mat-form-field>
          </div>

          <!-- Password Field -->
          <div class="form-field-wrapper">
            <mat-form-field appearance="outline" class="w-full custom-form-field">
              <input matInput 
                     [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="password" 
                     placeholder="Password">
              <mat-icon matSuffix 
                       class="suffix-icon cursor-pointer text-gray-400 hover:text-[#6C63FF] transition-colors"
                       (click)="hidePassword = !hidePassword">
                {{hidePassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
            </mat-form-field>
          </div>

          <div class="flex items-center justify-between text-sm">
            <mat-checkbox class="custom-checkbox text-gray-600">
              Remember me
            </mat-checkbox>
            <a class="text-[#6C63FF] hover:text-[#B06AB3] transition-colors cursor-pointer">
              Forgot password?
            </a>
          </div>

          <button type="submit"
                  [disabled]="loginForm.invalid || isLoading"
                  class="w-full py-3 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B06AB3] text-white font-semibold
                         hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed">
            <div class="flex items-center justify-center">
              <mat-spinner *ngIf="isLoading" [diameter]="24" class="mr-3"></mat-spinner>
              {{ isLoading ? 'Signing in...' : 'Login' }}
            </div>
          </button>

          <div class="text-center text-gray-600 text-sm">
            Not a member? 
            <a routerLink="/register" 
               class="text-[#6C63FF] hover:text-[#B06AB3] font-medium transition-colors cursor-pointer">
              Signup now
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .form-field-wrapper {
      position: relative;
    }

    ::ng-deep {
      .custom-form-field {
        .mat-mdc-form-field-outline {
          background-color: white;
        }

        .mdc-text-field--outlined {
          --mdc-outlined-text-field-container-shape: 9999px;
          border-radius: 9999px;
        }

        .mat-mdc-form-field-outline-start,
        .mat-mdc-form-field-outline-end,
        .mat-mdc-form-field-outline-gap {
          border-color: #e5e7eb !important;
          border-width: 1px;
        }

        .mdc-text-field--focused .mdc-notched-outline__leading,
        .mdc-text-field--focused .mdc-notched-outline__notch,
        .mdc-text-field--focused .mdc-notched-outline__trailing {
          border-color: #6C63FF !important;
          border-width: 2px;
        }

        .mdc-floating-label,
        input::placeholder {
          color: #9ca3af !important;
        }

        input.mat-mdc-input-element {
          padding: 12px 24px;
        }

        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }

      .custom-checkbox {
        .mdc-checkbox {
          .mdc-checkbox__background {
            border-color: #9ca3af !important;
          }
        }

        .mdc-checkbox--selected {
          .mdc-checkbox__background {
            background-color: #6C63FF !important;
            border-color: #6C63FF !important;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.snackBar.open('Successfully logged in!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['']);
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Login failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  close(): void {
    this.router.navigate(['']);
  }
}
