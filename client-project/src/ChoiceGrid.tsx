import React from 'react';
import _ from 'lodash';
import { BlockValue, ColumnIndex, getPiece, Grid, RowIndex } from 'nes-tetris-representation';
import { BlockProps, TetrisGrid } from 'nes-tetris-components';
import './PossibilityList.css';
import { Possibility } from './CommonModels';

interface ChoiceGridProps {
  grid: Grid;
  possibility: Possibility;
  setConsideredRowColumn: (row: RowIndex, columm: ColumnIndex) => void;
  onClick: () => void;
  freezeHover?: boolean;
}

function ChoiceGrid({ grid, possibility, setConsideredRowColumn, onClick, freezeHover = false }: ChoiceGridProps) {
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

  return (
    <TetrisGrid
      grid={grid}
      possiblePiece={possibility ? getPiece(possibility) : undefined}
      className="tetris-grid"
      getBlockProps={getBlockProps}
    />
  );
}

export default ChoiceGrid;
