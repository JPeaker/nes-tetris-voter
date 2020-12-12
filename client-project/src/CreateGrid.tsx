import { TetrisGrid, filledGrid } from 'nes-tetris-components';
import { BlockValue, ColumnIndex, Grid, RowIndex } from 'nes-tetris-representation';
import React, { useState } from 'react';
import _ from 'lodash';
import { CreateState } from './Create';

function CreateGrid({ state, grid, setGrid }: { state: CreateState, grid: Grid, setGrid: (grid: Grid) => void }) {
  const [hoverBlock, setHoverBlock] = useState<{ row: RowIndex, column: ColumnIndex } | null>(null);

  const getBlockProps = (row: RowIndex, column: ColumnIndex) => ({
    nearInvisible: state !== CreateState.TOGGLE_HOLES && !!hoverBlock && row >= hoverBlock.row && column === hoverBlock.column,
    slightlyHidden: !!hoverBlock && (
      state === CreateState.CHOOSE_COLUMNS ? row >= hoverBlock.row && column === hoverBlock.column :
      state === CreateState.TOGGLE_HOLES ? hoverBlock.row === row && hoverBlock.column === column && !!grid[row][column] :
      false
    ),
    onMouseEnter: () => setHoverBlock({ row, column }),
    onClick: () => {
      const newGrid = _.cloneDeep(grid);

      if (state === CreateState.CHOOSE_COLUMNS) {
        for (var i = 0; i < 22; i++) {
          if (i >= row) {
            newGrid[i][column] = filledGrid[i][column];
          } else {
            newGrid[i][column] = BlockValue.EMPTY;
          }
        }
      } else {
        newGrid[row][column] = grid[row][column] ? BlockValue.EMPTY : filledGrid[row][column];
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
