import React from 'react';
import _ from 'lodash';
import { BlockValue, ColumnIndex, getPiece, Grid, RowIndex } from 'nes-tetris-representation';
import { BlockProps, TetrisGrid } from 'nes-tetris-components';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import { ConsideredPlacement } from './Vote';

interface ChoiceGridProps {
  grid: Grid;
  possibilities: Possibility[];
  possibilityToRender: Possibility | null;
  setSelected?: (possibility: Possibility | null) => void;
  consideredPlacement: ConsideredPlacement;
  setConsideredPlacement?: (placement: ConsideredPlacement) => void;
}

type GridPossibilities = {
  [rowKey: number]: {
    [columnKey: number]: Possibility[]
  } | undefined;
}

function ChoiceGrid({ grid, possibilities, possibilityToRender, setSelected, consideredPlacement, setConsideredPlacement }: ChoiceGridProps) {
  const gridPossibilities = possibilities.reduce((accMap: GridPossibilities, possibility: Possibility) => {
    const newerMap = {...accMap};
    possibility.blocks.forEach(block => {
      if (!newerMap[block.row]) {
        newerMap[block.row] = {};
      }

      if (!newerMap[block.row]![block.column]) {
        newerMap[block.row]![block.column] = [possibility];
      } else {
        newerMap[block.row]![block.column].push(possibility);
      }
    });

    return newerMap;
  }, {} as GridPossibilities);
  const getBlockProps = (row: RowIndex, column: ColumnIndex, value: BlockValue) => {
    const props: Partial<BlockProps> = {};

    if (possibilityToRender && possibilityToRender.blocks.some(block => block.row === row && block.column === column)) {
      props.value = value;
    }

    const potentialPossibilities = gridPossibilities[row] && gridPossibilities[row]![column];
    if (potentialPossibilities && potentialPossibilities.length > 0 && setConsideredPlacement && setSelected) {
      props.onClick = () => {
        setSelected(possibilityToRender);
      }
      props.onMouseEnter = () => {
        setConsideredPlacement({ ...consideredPlacement, row, column });
      }
    }

    return props;
  }
  return (
    <TetrisGrid
      grid={grid}
      possiblePiece={possibilityToRender ? getPiece(possibilityToRender) : undefined}
      className="tetris-grid"
      getBlockProps={getBlockProps}
      onMouseLeave={setConsideredPlacement ? () => setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined }) : undefined}
    />
  );
}

export default ChoiceGrid;
