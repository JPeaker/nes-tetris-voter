import { TetrisGrid, filledGrid } from 'nes-tetris-components';
import { BlockValue, ColumnIndex, Grid, RowIndex } from 'nes-tetris-representation';
import React, { useState } from 'react';
import _ from 'lodash';

const emptyGrid: Grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

function CreateGrid() {
  const [hoverBlock, setHoverBlock] = useState<{ row: RowIndex, column: ColumnIndex } | null>(null);
  const [grid, setGrid] = useState<Grid>(emptyGrid);

  const getBlockProps = (row: RowIndex, column: ColumnIndex) => ({
    slightlyHidden: !!hoverBlock && row >= hoverBlock.row && column === hoverBlock.column,
    onMouseEnter: () => setHoverBlock({ row, column }),
    onClick: () => {
      const newGrid = _.cloneDeep(grid);
      for (var i = 0; i < 22; i++) {
        if (i >= row) {
          newGrid[i][column] = filledGrid[i][column];
        } else {
          newGrid[i][column] = BlockValue.EMPTY;
        }
      }
      setHoverBlock(null);
      setGrid(newGrid);
    },
  });

  return (
    <TetrisGrid
      grid={grid}
      className="tetris-grid"
      getBlockProps={getBlockProps}
      onMouseLeave={() => setHoverBlock(null)}
    />
  );
}

export default CreateGrid;
