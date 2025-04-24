import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class PasswordMatchErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control || !control.parent) {
      return false;
    }

    const hasPasswordError = control.parent.hasError('passwordNoMatch');

    const passwordControl = control.parent.get('password');
    const confirmPasswordControl = control.parent.get('confirmPassword');

    const isBothDirty = passwordControl?.dirty && confirmPasswordControl?.dirty;

    return !!(isBothDirty && hasPasswordError);
  }
}
