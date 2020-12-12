import { TetrisGrid } from 'nes-tetris-components';
import { getPieceGrid, Piece, PieceList } from 'nes-tetris-representation';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

function PieceSelect({ piece, setPiece, className }: { piece: Piece, setPiece: (piece: Piece) => void, className?: string }) {
  const onSelect = (label: string | null) => setPiece(PieceList.find(p => p.label === label)!.value);
  return (
    <Dropdown size="lg" as={ButtonGroup} onSelect={onSelect} className={`piece-select-dropdown ${className || ''}`} variant="dark">
      <Dropdown.Toggle variant="dark" className="piece-select-toggle">
        <TetrisGrid grid={getPieceGrid(piece)} blockSizeInRem={1.5} hideTopTwoRows={false} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {
          PieceList.map(({ value, label }) =>
            <Dropdown.Item variant="dark" eventKey={label} className="piece-select-item">
              <TetrisGrid
                className="tetris-grid"
                grid={getPieceGrid(value)}
                blockSizeInRem={1.5}
                hideTopTwoRows={false}
              />
            </Dropdown.Item>)
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PieceSelect;
