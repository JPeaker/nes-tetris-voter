import { TetrisGrid } from 'nes-tetris-components';
import { getPieceGrid, Grid, Piece } from 'nes-tetris-representation';
import React from 'react';
import { isXXlOrLarger } from './media-queries';

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
  ];

  const isMassiveScreen = isXXlOrLarger();
  const blockSize = isMassiveScreen ? 1.8023 : 1.26161;
  return <div className={classes.filter(c => !!c).join(' ')} onClick={onClick}>
    <TetrisGrid className="piece-select-grid" grid={piece !== null ? getPieceGrid(piece) : emptyPiece as Grid} hideTopTwoRows={false} blockSizeInRem={blockSize * 3/4}/>
  </div>;
}

export default PieceSelect;
