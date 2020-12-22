import React from 'react';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import { UploadIcon } from '@primer/octicons-react';
import { Grid } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';

export enum CreateToolType {
  ADD_COLUMNS,
  TOGGLE_BLOCKS,
  UPLOAD,
};

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
    default:
      throw new Error('Unknown CreateTool Type');
  }
}

function CreateTool({ variant, selected = false, setTool }: { variant: CreateToolType, selected?: boolean, setTool: (tool: CreateToolType) => void }) {
  const content = mapTypeToContent(variant);
  return <Card className={`create-tool my-2 ${selected ? 'selected' : ''}`} onClick={() => setTool(variant)}>
    <Card.Body>
      { content.icon }
      <Card.Title style={{ marginBottom: 0 }}>{ content.label }</Card.Title>
    </Card.Body>
  </Card>;
}

export default CreateTool;
