export interface LatexMenuItem {
  label: string;
  latex: string;
  preview?: string;
  description?: string;
  category?: string;
}

export interface LatexSection {
  label: string;
  commands: LatexCommand[];
}

export interface LatexCommand {
  label: string;
  value: string;
}
