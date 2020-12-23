import { TetrisGrid, filledGrid } from 'nes-tetris-components';
import { BlockValue, ColumnIndex, Grid, RowIndex } from 'nes-tetris-representation';
import React, { useState } from 'react';
import _ from 'lodash';
import { CreateToolType } from './CreateTool';

function CreateGrid({ state, setState, grid, setGrid }: { state: CreateToolType | null, setState: (state: CreateToolType) => void, grid: Grid, setGrid: (grid: Grid) => void }) {
  const [hoverBlock, setHoverBlock] = useState<{ row: RowIndex, column: ColumnIndex } | null>(null);

  const getBlockProps = (row: RowIndex, column: ColumnIndex) => ({
    nearInvisible: state !== CreateToolType.TOGGLE_BLOCKS && !!hoverBlock && row >= hoverBlock.row && column === hoverBlock.column,
    slightlyHidden: !!hoverBlock && (
      state === CreateToolType.ADD_COLUMNS ? row >= hoverBlock.row && column === hoverBlock.column :
      state === CreateToolType.TOGGLE_BLOCKS ? hoverBlock.row === row && hoverBlock.column === column :
      false
    ),
    onMouseEnter: () => state !== null && setHoverBlock({ row, column }),
    onClick: () => {
      if (state === null) {
        setState(CreateToolType.ADD_COLUMNS);
        return;
      }

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
    'create-border',
    grid.some(row => row.every(block => block !== BlockValue.EMPTY)) ? '' : 'complete',
    state !== null ? 'active' : '',
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
