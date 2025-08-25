import { computed, effect, Injectable, signal } from '@angular/core';
import { Tile } from './pathfinder';
import { STORAGE_KEYS } from '@hz/core/constants';

@Injectable({
  providedIn: 'root',
})
export class PathfinderService {
  private _board = signal<Tile[][] | null>(null);
  readonly board = this._board.asReadonly();

  readonly hasBoard = computed(() => !!this._board());
  readonly boardRows = computed(() => {
    const board = this._board();
    return board ? board.length : 0;
  });

  readonly boardCols = computed(() => {
    const board = this._board();
    return board && board[0] ? board[0].length : 0;
  });

  constructor() {
    effect(() => {
      this.saveBoard();
      console.log(this._board());
    });
  }

  saveBoard() {
    localStorage.setItem(STORAGE_KEYS.PATHFINDER.BOARD, JSON.stringify(this._board()));
  }

  loadBoard(): Tile[][] | null {
    const board = localStorage.getItem(STORAGE_KEYS.PATHFINDER.BOARD);
    if (board) {
      const parsedBoard = JSON.parse(board);
      return parsedBoard as Tile[][];
    }
    return null;
  }

  createBoard(rows: number, columns: number) {
    const newBoard: Tile[][] = [];

    for (let row = 0; row < rows; row++) {
      const rowArray: Tile[] = [];
      for (let column = 0; column < columns; column++) {
        rowArray.push({
          row,
          column,
          isStart: false,
          isEnd: false,
          isWall: false,
          hasWeight: false,
          weight: 0,
        });
      }
      newBoard.push(rowArray);
    }

    this._board.set(newBoard);
  }
}
