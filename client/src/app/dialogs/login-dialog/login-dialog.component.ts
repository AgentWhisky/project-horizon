import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { passwordMatch } from '../../validators/password-match.validator';
import { UppercaseDirective } from '../../directives/uppercase.directive';
import { NewAccountCredentials } from '../../types/login-credentials';
import { UserService } from '../../services/user.service';
import { ValidatorMessagePipe } from '../../pipes/validator-message.pipe';

@Component({
  selector: 'app-login-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    UppercaseDirective,
    ValidatorMessagePipe,
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  readonly fb = inject(FormBuilder);
  private userService = inject(UserService);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly newAccountForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required, passwordMatch('password')]],
    creationCode: ['', [Validators.required]],
  });

  async onLogin() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (username && password) {
      const result = await this.userService.login({ username, password });

      if (result) {
        this.dialogRef.close();
      }
    }
  }

  async onCreateAccount() {
    const name = this.newAccountForm.value.name;
    const username = this.newAccountForm.value.username;
    const password = this.newAccountForm.value.password;
    const creationCode = this.newAccountForm.value.creationCode;

    if (name && username && password && creationCode) {
      const newAccountCredentials: NewAccountCredentials = {
        name,
        username,
        password,
        creationCode,
      };

      const result = await this.userService.register(newAccountCredentials);

      if (result) {
        this.dialogRef.close();
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  // *** PASSWORD VISIBILITY ***
  onShowPassword() {
    this.showPassword.set(true);
  }

  onHidePassword() {
    this.showPassword.set(false);
  }

  onShowConfirmPassword() {
    this.showConfirmPassword.set(true);
  }

  onHideConfirmPassword() {
    this.showConfirmPassword.set(false);
  }
}
