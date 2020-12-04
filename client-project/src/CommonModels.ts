import { ColumnIndex, Grid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';

export interface Possibility {
  id: string;
  blocks: { row: RowIndex; column: ColumnIndex }[];
  orientation: Orientation;
  type: Piece;
  row: RowIndex;
  column: ColumnIndex;
  votes: number;
}

export interface Board {
  id: string;
  board: Grid;
  currentPiece: Piece;
  nextPiece: Piece;
  possibilities: Possibility[];
}