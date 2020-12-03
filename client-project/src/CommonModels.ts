import { ColumnIndex, Grid, Piece, RowIndex } from 'nes-tetris-representation';

export interface Possibility {
  id: string;
  blocks: { row: RowIndex; column: ColumnIndex }[];
  votes: number;
}

export interface Board {
  id: string;
  board: Grid;
  currentPiece: Piece;
  possibilities: Possibility[];
}