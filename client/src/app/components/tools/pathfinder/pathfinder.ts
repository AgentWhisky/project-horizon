export interface Tile {
  row: number;
  column: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  hasWeight: boolean;
  weight: number;
}

export interface BoardSize {
  rows: number;
  columns: number;
}
