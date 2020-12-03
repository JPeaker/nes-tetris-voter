import { ActivePiece, ColumnIndex, getPiece, Grid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import { uniqBy } from 'lodash';
import { Possibility } from './data/entity/Possibility';

type BoardPosition = {
  row: RowIndex,
  column: ColumnIndex,
  orientation: Orientation,
  type: Piece,
}

const canPieceMove = (position: BoardPosition, grid: Grid): boolean => {
  try {
    return getPiece(position).blocks.every(block => (
      block.row >= 0 &&
      block.row < 22 &&
      block.column >= 0 &&
      block.column < 10 &&
      (grid[block.row] && grid[block.row][block.column] === 0)
    ));
  } catch (e) {
    return false;
  }
};

const canMoveLeft = (piece: BoardPosition, grid: Grid): boolean => canPieceMove({ ...piece, column: piece.column - 1 as ColumnIndex }, grid);
const canMoveRight = (piece: BoardPosition, grid: Grid): boolean => canPieceMove({ ...piece, column: piece.column + 1 as ColumnIndex }, grid);
const canMoveDown = (piece: BoardPosition, grid: Grid,): boolean => canPieceMove({ ...piece, row: piece.row + 1 as ColumnIndex }, grid);
const canRotateClockwise = (piece: BoardPosition, grid: Grid): boolean => canPieceMove({ ...piece, orientation: (piece.orientation + 1) % 4 as Orientation }, grid);
const canRotateCounterClockwise = (piece: BoardPosition, grid: Grid): boolean => canPieceMove({ ...piece, orientation: (piece.orientation + 3) % 4 as Orientation }, grid);

const serializePosition = ({ row, column, orientation, type }: BoardPosition): string => `${row},${column},${orientation},${type}`;
const deserializePosition = (serial: string): BoardPosition => {
  const split = serial.split(',');

  return {
    row: parseInt(split[0]) as RowIndex,
    column: parseInt(split[1]) as ColumnIndex,
    orientation: parseInt(split[2]) as Orientation,
    type: split[3] as unknown as Piece,
  };
}

const moveLeft = (piece: BoardPosition): BoardPosition => ({ ...piece, column: piece.column-1 as ColumnIndex });
const moveRight = (piece: BoardPosition): BoardPosition => ({ ...piece, column: piece.column+1 as ColumnIndex });
const moveDown = (piece: BoardPosition): BoardPosition => ({ ...piece, row: piece.row+1 as RowIndex });
const rotateClockwise = (piece: BoardPosition): BoardPosition => {
  let newOrientation: Orientation;
  switch (piece.orientation) {
    case Orientation.Up:
      newOrientation = Orientation.Right;
      break;
    case Orientation.Right:
      newOrientation = Orientation.Down;
      break;
    case Orientation.Down:
      newOrientation = Orientation.Left;
      break;
    case Orientation.Left:
      newOrientation = Orientation.Up;
      break;
    default:
      throw new Error('Unknown orientation');
  }

  return { ...piece, orientation: newOrientation };
};
const rotateCounterClockwise = (position: BoardPosition): BoardPosition => rotateClockwise(rotateClockwise(rotateClockwise(position)));

const subFindPositions = (visitedPositions: Set<string>, grid: Grid): Set<string> => {
  const totalNewPositions = new Set<string>(visitedPositions);
  visitedPositions.forEach(str => {
    const position = deserializePosition(str);
    if (canMoveLeft(position, grid) && !totalNewPositions.has(serializePosition(moveLeft(position)))) {
      totalNewPositions.add(serializePosition(moveLeft(position)));
    }
    if (canMoveRight(position, grid) && !totalNewPositions.has(serializePosition(moveRight(position)))) {
      totalNewPositions.add(serializePosition(moveRight(position)));
    }
    if (canMoveDown(position, grid) && !totalNewPositions.has(serializePosition(moveDown(position)))) {
      totalNewPositions.add(serializePosition(moveDown(position)));
    }
    if (canRotateClockwise(position, grid) && !totalNewPositions.has(serializePosition(rotateClockwise(position)))) {
      totalNewPositions.add(serializePosition(rotateClockwise(position)));
    }
    if (canRotateCounterClockwise(position, grid) && !totalNewPositions.has(serializePosition(rotateCounterClockwise(position)))) {
      totalNewPositions.add(serializePosition(rotateCounterClockwise(position)));
    }
  });

  if (totalNewPositions.size === visitedPositions.size) {
    var finalPositions = new Set<string>(visitedPositions);

    visitedPositions.forEach(str => {
      if (canMoveDown(deserializePosition(str), grid)) {
        finalPositions.delete(str);
      }
    });

    return finalPositions;
  } else {
    return subFindPositions(totalNewPositions, grid);
  }
}

export const findAllPossiblePositions = (position: Omit<ActivePiece, 'blocks'>, grid: Grid): Possibility[] => {
  const results = [...subFindPositions(new Set<string>([serializePosition(position)]), grid)].map(serialized => {
    const deserialized = deserializePosition(serialized);

    return getPiece({
      type: position.type,
      row: deserialized.row,
      column: deserialized.column,
      orientation: deserialized.orientation,
    });
  });

  return uniqBy(results, piece => piece.blocks.map(block => `${block.column},${block.row}`).join('.')).filter(piece => canPieceMove(piece, grid)).map(piece => {
    const possibility = new Possibility();
    possibility.type = piece.type;
    possibility.block1X = piece.blocks[0].column;
    possibility.block1Y = piece.blocks[0].row;
    possibility.block2X = piece.blocks[1].column;
    possibility.block2Y = piece.blocks[1].row;
    possibility.block3X = piece.blocks[2].column;
    possibility.block3Y = piece.blocks[2].row;
    possibility.block4X = piece.blocks[3].column;
    possibility.block4Y = piece.blocks[3].row;
    return possibility;
  });
};