import React from 'react';
import _ from 'lodash';
import { BlockValue, ColumnIndex, getPiece, getPieceGrid, Grid, Piece, PieceList, RowIndex } from 'nes-tetris-representation';
import { BlockProps, TetrisGrid } from 'nes-tetris-components';
import './PossibilityList.css';
import { Possibility } from './CommonModels';

interface ChoiceGridProps {
  grid: Grid;
  possibility: Possibility;
  nextPiece: Piece;
  setConsideredRowColumn: (row: RowIndex, columm: ColumnIndex) => void;
  onClick: () => void;
  freezeHover?: boolean;
}

function ChoiceGrid({ grid, possibility, nextPiece, setConsideredRowColumn, onClick, freezeHover = false }: ChoiceGridProps) {
  const getBlockProps = (row: RowIndex, column: ColumnIndex, value: BlockValue) => {
    const props: Partial<BlockProps> = {};

    if (!freezeHover) {
      props.onMouseEnter = () => setConsideredRowColumn(row, column);
    }

    if (possibility && possibility.blocks.some(block => block.row === row && block.column === column)) {
      props.value = value;
      props.onClick = onClick;
    }

    return props;
  }

  const pieceLabel = PieceList.find(p => p.value === nextPiece)!.label;
  return (
    <div className="tetris-grid-wrapper">
      <TetrisGrid
        grid={grid}
        possiblePiece={possibility ? getPiece(possibility) : undefined}
        className="tetris-grid"
        getBlockProps={getBlockProps}
      />
      <TetrisGrid grid={getPieceGrid(nextPiece)} hideTopTwoRows={false} blockSizeInRem={1.5} className={`next-piece next-piece-${pieceLabel}`} />
    </div>
  );
}

export default ChoiceGrid;
