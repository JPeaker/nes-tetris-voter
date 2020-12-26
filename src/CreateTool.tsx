import React from 'react';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import { UploadIcon } from '@primer/octicons-react';
import { getPieceGrid, Grid, Piece } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';

export enum CreateToolType {
  ADD_COLUMNS,
  TOGGLE_BLOCKS,
  UPLOAD,
  SELECT_CURRENT_T,
  SELECT_CURRENT_I,
  SELECT_CURRENT_O,
  SELECT_CURRENT_S,
  SELECT_CURRENT_Z,
  SELECT_CURRENT_J,
  SELECT_CURRENT_L,
  SELECT_NEXT_T,
  SELECT_NEXT_I,
  SELECT_NEXT_O,
  SELECT_NEXT_S,
  SELECT_NEXT_Z,
  SELECT_NEXT_J,
  SELECT_NEXT_L,
};

const getPieceContent = (piece: Piece) => ({ icon: <TetrisGrid grid={getPieceGrid(piece)} blockSizeInRem={1} hideTopTwoRows={false} transparentEmptyBlocks />, label: '' });
const mapTypeToContent = (type: CreateToolType): { icon: JSX.Element, label: string } => {
  switch (type) {
    case CreateToolType.ADD_COLUMNS:
      const columnsGrid = [
        [2,0,0],
        [1,3,0],
        [3,1,1],
      ];
      return { icon: <TetrisGrid grid={columnsGrid as Grid} blockSizeInRem={1.25} hideTopTwoRows={false} />, label: 'Set Column' };
    case CreateToolType.TOGGLE_BLOCKS:
      const blocksGrid = [
        [1,0,0],
        [0,0,0],
        [0,3,0],
      ];
      return { icon: <TetrisGrid grid={blocksGrid as Grid} blockSizeInRem={1.25} hideTopTwoRows={false} />, label: 'Toggle Block' };
    case CreateToolType.UPLOAD:
      return { icon: <UploadIcon size={64} />, label: 'Upload' };
    case CreateToolType.SELECT_CURRENT_T:
      return getPieceContent(Piece.T);
    case CreateToolType.SELECT_CURRENT_I:
      return getPieceContent(Piece.I);
    case CreateToolType.SELECT_CURRENT_O:
      return getPieceContent(Piece.O);
    case CreateToolType.SELECT_CURRENT_S:
      return getPieceContent(Piece.S);
    case CreateToolType.SELECT_CURRENT_Z:
      return getPieceContent(Piece.Z);
    case CreateToolType.SELECT_CURRENT_J:
      return getPieceContent(Piece.J);
    case CreateToolType.SELECT_CURRENT_L:
      return getPieceContent(Piece.L);
    case CreateToolType.SELECT_NEXT_T:
      return getPieceContent(Piece.T);
    case CreateToolType.SELECT_NEXT_I:
      return getPieceContent(Piece.I);
    case CreateToolType.SELECT_NEXT_O:
      return getPieceContent(Piece.O);
    case CreateToolType.SELECT_NEXT_S:
      return getPieceContent(Piece.S);
    case CreateToolType.SELECT_NEXT_Z:
      return getPieceContent(Piece.Z);
    case CreateToolType.SELECT_NEXT_J:
      return getPieceContent(Piece.J);
    case CreateToolType.SELECT_NEXT_L:
      return getPieceContent(Piece.L);
    default:
      throw new Error('Unknown CreateTool Type');
  }
}

function CreateTool({ variant, selected = false, setTool }: { variant: CreateToolType, selected?: boolean, setTool: (tool: CreateToolType) => void }) {
  const content = mapTypeToContent(variant);
  return <Card className={`create-tool my-2 ${selected ? 'selected' : ''}`} onClick={() => setTool(variant)}>
    <Card.Body className="center-tool">
      { content.icon }
      <Card.Title style={{ marginBottom: 0 }}>{ content.label }</Card.Title>
    </Card.Body>
  </Card>;
}

export default CreateTool;
