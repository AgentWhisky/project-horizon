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
  id: number;
  label: string;
  value: string;
}
