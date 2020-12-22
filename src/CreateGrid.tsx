import { TetrisGrid, filledGrid } from 'nes-tetris-components';
import { BlockValue, ColumnIndex, Grid, RowIndex } from 'nes-tetris-representation';
import React, { useState } from 'react';
import _ from 'lodash';
import { CreateToolType } from './CreateTool';

function CreateGrid({ state, grid, setGrid }: { state: CreateToolType | null, grid: Grid, setGrid: (grid: Grid) => void }) {
  const [hoverBlock, setHoverBlock] = useState<{ row: RowIndex, column: ColumnIndex } | null>(null);

  const getBlockProps = (row: RowIndex, column: ColumnIndex) => ({
    nearInvisible: state !== CreateToolType.TOGGLE_BLOCKS && !!hoverBlock && row >= hoverBlock.row && column === hoverBlock.column,
    slightlyHidden: !!hoverBlock && (
      state === CreateToolType.ADD_COLUMNS ? row >= hoverBlock.row && column === hoverBlock.column :
      state === CreateToolType.TOGGLE_BLOCKS ? hoverBlock.row === row && hoverBlock.column === column :
      false
    ),
    onMouseEnter: () => setHoverBlock({ row, column }),
    onClick: () => {
      const newGrid = _.cloneDeep(grid);

      if (state === CreateToolType.ADD_COLUMNS) {
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

  const classes = [
    'tetris-grid-create',
    state !== null ? 'create-border' : '',
    grid.some(row => row.some(block => block !== BlockValue.EMPTY)) ? 'complete' : '',
  ];

  return (
    <TetrisGrid
      grid={grid}
      className={classes.filter(c => !!c).join(' ')}
      getBlockProps={getBlockProps}
      onMouseLeave={() => setHoverBlock(null)}
    />
  );
}

export default CreateGrid;
