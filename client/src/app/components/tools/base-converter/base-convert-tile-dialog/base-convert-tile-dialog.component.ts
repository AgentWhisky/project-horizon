import { Component, computed, effect, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ValidatorMessagePipe } from '../../../../pipes/validator-message.pipe';
import { MatSelectModule } from '@angular/material/select';
import { baseNames } from '../../../../utilities/base-conversion.util';
import { filter, tap } from 'rxjs';

interface DialogData {
  existingBases: number[];
}

interface DialogResult {
  status: boolean;
  base: number;
  conversions: number[];
}

@Component({
  selector: 'app-base-convert-tile-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './base-convert-tile-dialog.component.html',
  styleUrl: './base-convert-tile-dialog.component.scss',
})
export class BaseConvertTileDialogComponent {
  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<BaseConvertTileDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly baseForm = this.getBaseForm();
  readonly baseNames = baseNames;

  readonly initBases = defaultNumericBases.filter((base) => !this.data.existingBases.includes(base));

  readonly primaryBases = signal<number[]>([...this.initBases]);
  readonly conversionBases = signal<number[]>([...this.initBases]);

  constructor() {
    // Filter Conversion Bases on Primary Base Selection
    this.baseForm
      .get('base')
      ?.valueChanges.pipe(
        tap((base) => {
          if (base) {
            const bases = this.initBases.filter((item) => item !== base);
            this.conversionBases.set([...bases]);
          } else {
            this.conversionBases.set([...this.initBases]);
          }
        })
      )
      .subscribe();

    // Filter Primary Bases on Conversion Base Selection
    this.baseForm
      .get('conversions')
      ?.valueChanges.pipe(
        tap((conversions) => {
          const validConversions: number[] = Array.isArray(conversions) ? conversions : [];

          if (validConversions) {
            const bases = this.initBases.filter((item) => !validConversions.includes(item));
            this.primaryBases.set([...bases]);
          } else {
            this.primaryBases.set([...this.initBases]);
          }
        })
      )
      .subscribe();
  }

  getBaseForm() {
    return this.fb.group({
      base: [null, [Validators.required]],
      conversions: [[]],
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
      base: this.baseForm.value.base ?? 0,
      conversions: this.baseForm.value.conversions ?? [],
    };

    this.dialogRef.close(dialogResult);
  }
}

const defaultNumericBases: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 26, 32, 36];
