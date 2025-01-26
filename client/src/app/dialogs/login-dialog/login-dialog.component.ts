import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login-dialog',
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  readonly fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);

  readonly showPassword = signal(false);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onLogin() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (username && password) {
      this.authService.handleLogin(username, password);

      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onShowPassword() {
    this.showPassword.set(true);
  }

  onHidePassword() {
    this.showPassword.set(false);
  }
}
