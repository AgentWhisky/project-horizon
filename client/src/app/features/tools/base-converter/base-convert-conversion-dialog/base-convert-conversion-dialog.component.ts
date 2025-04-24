import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { baseNames, defaultNumericBases } from '../base-converter.config';

interface DialogData {
  base: number;
  existingConversions: number[];
}

interface DialogResult {
  status: boolean;
  conversions: number[];
}

@Component({
  selector: 'app-base-convert-conversion-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './base-convert-conversion-dialog.component.html',
  styleUrl: './base-convert-conversion-dialog.component.scss',
})
export class BaseConvertConversionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<BaseConvertConversionDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly conversionForm = this.getConversionForm();
  readonly baseNames = baseNames;

  readonly defaultBases = defaultNumericBases.filter((item) => item !== this.data.base);

  ngOnInit() {
    console.log(this.data.existingConversions);

    this.conversionForm.patchValue({
      conversions: this.data.existingConversions ?? [],
    });
  }

  getConversionForm() {
    return this.fb.group({
      conversions: [[] as number[]],
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
      conversions: this.conversionForm.value.conversions ?? [],
    };

    this.dialogRef.close(dialogResult);
  }
}
