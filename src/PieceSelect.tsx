import { TetrisGrid } from 'nes-tetris-components';
import { getPieceGrid, Grid, Piece } from 'nes-tetris-representation';
import React from 'react';

function PieceSelect({ piece, className, active, onClick }: { piece: Piece | null, active: boolean, className: string, onClick: () => void }) {
  const classes = [
    className,
    'create-border',
    piece !== null && !active ? 'complete' : undefined,
    active ? 'active' : undefined,
  ]

  const emptyPiece = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  return <div className={classes.filter(c => !!c).join(' ')} onClick={onClick}>
    <TetrisGrid className="piece-select-grid" grid={piece !== null ? getPieceGrid(piece) : emptyPiece as Grid} hideTopTwoRows={false} blockSizeInRem={1.5}/>
  </div>;
}

export default PieceSelect;
