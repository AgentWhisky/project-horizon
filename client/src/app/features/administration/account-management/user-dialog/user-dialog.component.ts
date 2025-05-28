import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AccountManagementService } from '../account-management.service';
import { UserCode, UserPayload } from '../account-management';

interface DialogData {
  type: 'create' | 'update';
  user?: UserCode;
}

interface DialogResult {
  status: boolean;
  userData: UserPayload;
}

@Component({
  selector: 'hz-user-dialog',
  imports: [MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private accountManagementService = inject(AccountManagementService);

  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly roles = this.accountManagementService.roles;

  readonly userForm = this.getUserForm(this.data.type === 'update', this.data.user);

  getUserForm(isUpdate: boolean, user?: UserCode) {
    return this.fb.group({
      name: [isUpdate && user ? user.name : '', [Validators.required, Validators.maxLength(30)]],
      roles: [isUpdate && user ? user.roles?.map((role) => role.id) : []],
    });
  }

  onClose() {
    this.dialogRef.close({
      status: false,
    });
  }

  onSubmit() {
    const dialogResult: DialogResult = {
      status: true,
      userData: {
        name: this.userForm.value.name ?? '',
        roles: this.userForm.value.roles ?? [],
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
