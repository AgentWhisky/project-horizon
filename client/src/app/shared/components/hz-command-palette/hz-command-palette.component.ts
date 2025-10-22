import { Component, computed, effect, ElementRef, HostListener, input, model, signal, ViewChild } from '@angular/core';

import { HzCommand } from './hz-command-palette.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hz-command-palette',
  imports: [MatInputModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
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
    const commandQuery = this.commandQuery();

    return commands
      .filter(
        (command) =>
          (command.label && command.label.toLowerCase().includes(commandQuery)) ||
          (command.value && command.value.toLowerCase().includes(commandQuery)) ||
          (command.example && command.example.toLowerCase().includes(commandQuery))
      )
      .slice(0, 30);
  });

  readonly results = signal<HzCommand[]>([]);
  readonly isActive = signal(false);

  constructor() {
    effect(() => console.log(this.commandQuery()));
    effect(() => console.log(this.queryResults()));
  }

  onResetFilter() {
    this.commandQuery.set('');
  }

  selectCommand(cmd: HzCommand) {
    console.log('Selected Command:', cmd.value);
    this.commandQuery.set('');
    this.isActive.set(false);
  }

  // TEST
  @ViewChild('commandInput', { read: ElementRef }) inputRef!: ElementRef<HTMLInputElement>;
  dropdownStyles = signal<Partial<CSSStyleDeclaration>>({});

  onFocus(input: HTMLInputElement) {
    this.isActive.set(true);
    this.updateDropdownPosition(input);
  }

  onBlur() {
    setTimeout(() => this.isActive.set(false), 100);
  }

  updateDropdownPosition(input: HTMLInputElement) {
    // find the nearest mat-form-field wrapper (the real visual container)
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
