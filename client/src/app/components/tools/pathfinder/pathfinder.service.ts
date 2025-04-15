import { effect, Injectable, signal } from '@angular/core';
import { BoardSize, Tile } from './pathfinder';

@Injectable({
  providedIn: 'root',
})
export class PathfinderService {
  private _board = signal<Tile[][]>([]);
  readonly board = this._board.asReadonly();

  private _boardSize = signal<BoardSize>({ rows: 0, columns: 0 });
  readonly boardSize = this._boardSize.asReadonly();

  readonly hasBoard = signal<boolean>(false);

  constructor() {
    effect(() => console.log(this._board()));
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
    this._boardSize.set({ rows, columns });
    this.hasBoard.set(true);
  }
}
