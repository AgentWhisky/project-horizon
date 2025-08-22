import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PasswordMatchErrorStateMatcher } from './password-matcher';
import { UppercaseDirective } from '../../../core/directives/uppercase.directive';
import { ValidatorMessagePipe } from '../../../core/pipes/validator-message.pipe';
import { UserService } from '../../../core/services/user.service';
import { confirmPasswordValidator } from '../../../core/validators/confirm-password.validator';
import { NewAccountCredentials } from '../../../core/models/login-credentials.model';

@Component({
  selector: 'hz-login-dialog',
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

  readonly newAccountForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      creationCode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{12}$/)]],
    },
    { validators: confirmPasswordValidator }
  );

  readonly passwordMatcher = new PasswordMatchErrorStateMatcher();

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
