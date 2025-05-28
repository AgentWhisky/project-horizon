import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { RoleCode, RolePayload } from '../account-management';
import { AccountManagementService } from '../account-management.service';

interface DialogData {
  type: 'create' | 'update';
  role?: RoleCode;
}

interface DialogResult {
  status: boolean;
  roleData: RolePayload;
}

@Component({
  selector: 'hz-role-dialog',
  imports: [MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.scss',
})
export class RoleDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly accountManagementService = inject(AccountManagementService);

  readonly roleForm = this.getRoleForm(this.data.type === 'update', this.data.role);

  readonly rights = this.accountManagementService.rights;

  getRoleForm(isUpdate: boolean, role?: RoleCode) {
    const newForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      rights: [<number[]>[], [Validators.required]],
    });

    if (isUpdate && role) {
      newForm.patchValue({
        name: role.name,
        description: role.description,
        rights: role.rights.map((right) => right.id) ?? [],
      });
    }

    return newForm;
  }

  onSubmit() {
    const dialogResult: DialogResult = {
      status: true,
      roleData: {
        name: this.roleForm.value.name ?? '',
        description: this.roleForm.value.description ?? '',
        rights: this.roleForm.value.rights ?? [],
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
