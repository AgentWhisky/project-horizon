export interface LatexMenuItem {
  label: string;
  latex: string;
  preview?: string;
  description?: string;
  category?: string;
}

export interface LatexSection {
  lable: string;
  commands: LatexCommand[];
}

export interface LatexCommand {
  label: string;
  latex: string;
  example: string;
  category: string;
}
