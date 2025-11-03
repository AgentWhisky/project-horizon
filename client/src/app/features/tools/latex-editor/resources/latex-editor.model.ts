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

export interface SavedCurrentExpression {
  expression: string;
  isTouched: boolean;
  isDirty: boolean;
}

export interface SavedExpression {
  id: number;
  name: string;
  expression: string;
}
