import React from 'react';
import _ from 'lodash';
import { BlockValue, ColumnIndex, filledGrid, getPiece, getPieceGrid, Grid, Piece, PieceList, RowIndex } from 'nes-tetris-representation';
import { BlockProps, TetrisGrid } from 'nes-tetris-components';
import './ChoiceGrid.css';
import { Possibility } from './CommonModels';
import { isMdOrSmaller, isSmOrSmaller, isXlOrLarger, isXsOrSmaller } from './media-queries';

interface ChoiceGridProps {
  grid: Grid;
  possibility: Possibility;
  nextPiece: Piece | null;
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

  const xsOrSmaller = isXsOrSmaller();
  const smOrSmaller = isSmOrSmaller();
  const mdOrSmaller = isMdOrSmaller();
  const blockSize = xsOrSmaller ? 0.8 : smOrSmaller ? 1.25 : mdOrSmaller ? 1.5 : 1.63334;

  return (
    <div className="tetris-grid-wrapper">
      <TetrisGrid
        grid={grid}
        possiblePiece={possibility ? getPiece(possibility) : undefined}
        className="tetris-grid-vote"
        blockSizeInRem={blockSize}
        getBlockProps={getBlockProps}
      />
      {
        nextPiece !== null
          ? <TetrisGrid grid={getPieceGrid(nextPiece)} hideTopTwoRows={false} blockSizeInRem={blockSize * 3/4} className="next-piece-vote" />
          : null
      }
    </div>
  );
}

export default ChoiceGrid;
