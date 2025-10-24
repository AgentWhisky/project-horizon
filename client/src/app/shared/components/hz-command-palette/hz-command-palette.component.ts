import { Component, computed, effect, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { KatexPipe } from '@hz/core/pipes/katex.pipe';

import { HzCommand } from './hz-command-palette.model';

@Component({
  selector: 'hz-command-palette',
  imports: [MatInputModule, MatButtonModule, MatIconModule, CommonModule, FormsModule, KatexPipe],
  templateUrl: './hz-command-palette.component.html',
  styleUrl: './hz-command-palette.component.scss',
})
export class HzCommandPaletteComponent {
  readonly commands = input.required<HzCommand[]>();

  readonly label = input<string>('Command Palette');
  readonly placeholder = input<string>('Type a command or search...');

  readonly commandQuery = model('');
  readonly queryResults = computed(() => {
    const commands = this.commands();
    const commandQuery = this.commandQuery().toLowerCase();

    return commands
      .filter(
        (command) =>
          (command.label && command.label.toLowerCase().includes(commandQuery)) ||
          (command.value && command.value.toLowerCase().includes(commandQuery)) ||
          (command.example && command.example.toLowerCase().includes(commandQuery))
      )
      .slice(0, 30);
  });

  readonly isActive = signal(false);
  readonly dropdownStyles = signal<Partial<CSSStyleDeclaration>>({});

  onResetFilter() {
    this.commandQuery.set('');
  }

  selectCommand(cmd: HzCommand) {
    console.log('Selected Command:', cmd.value);
    this.commandQuery.set('');
    this.isActive.set(false);
  }

  onFocus(input: HTMLInputElement) {
    this.isActive.set(true);
    this.updateDropdownPosition(input);
  }

  onBlur() {
    setTimeout(() => this.isActive.set(false), 100);
  }

  updateDropdownPosition(input: HTMLInputElement) {
    const formField = input.closest('.mat-mdc-form-field') as HTMLElement;
    const rect = formField?.getBoundingClientRect() ?? input.getBoundingClientRect();

    this.dropdownStyles.set({
      position: 'fixed',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      zIndex: '2000',
    });
  }
}
