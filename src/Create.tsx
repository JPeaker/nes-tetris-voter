import { Grid, Piece } from 'nes-tetris-representation';
import React, { useRef, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button, CardColumns } from 'react-bootstrap';
import inputHandler from './input-handler';
import _, { map } from 'lodash';
import CreateGrid from './CreateGrid';
import current from './current-text.png';
import { emptyGrid } from './emptyGrid';
import CreateTool, { CreateToolType } from './CreateTool';
import PieceSelect from './PieceSelect';

export enum CreateMode {
  SET_GRID,
  SELECT_CURRENT_PIECE,
  SELECT_NEXT_PIECE,
};

const setGridTools = [
  CreateToolType.ADD_COLUMNS,
  CreateToolType.TOGGLE_BLOCKS,
  CreateToolType.UPLOAD,
];

const setCurrentTools = [
  CreateToolType.SELECT_CURRENT_T,
  CreateToolType.SELECT_CURRENT_I,
  CreateToolType.SELECT_CURRENT_O,
  CreateToolType.SELECT_CURRENT_S,
  CreateToolType.SELECT_CURRENT_Z,
  CreateToolType.SELECT_CURRENT_J,
  CreateToolType.SELECT_CURRENT_L,
];

const setNextTools = [
  CreateToolType.SELECT_NEXT_T,
  CreateToolType.SELECT_NEXT_I,
  CreateToolType.SELECT_NEXT_O,
  CreateToolType.SELECT_NEXT_S,
  CreateToolType.SELECT_NEXT_Z,
  CreateToolType.SELECT_NEXT_J,
  CreateToolType.SELECT_NEXT_L,
];

const mapToolToMode = (tool: CreateToolType) => {
  if (setGridTools.includes(tool)) {
    return CreateMode.SET_GRID;
  } else if (setCurrentTools.includes(tool)) {
    return CreateMode.SELECT_CURRENT_PIECE;
  } else if (setNextTools.includes(tool)) {
    return CreateMode.SELECT_NEXT_PIECE;
  } else {
    throw new Error('Unknown mode. How did you get here?!');
  }
}

const getDefaultTool = (mode: CreateMode) => {
  switch (mode) {
    case CreateMode.SET_GRID:
      return CreateToolType.ADD_COLUMNS;
    default:
      return CreateToolType.ADD_COLUMNS;
  }
};

const getPieceFromTool = (tool: CreateToolType): Piece => {
  switch (tool) {
    case CreateToolType.SELECT_CURRENT_T:
    case CreateToolType.SELECT_NEXT_T:
      return Piece.T;
    case CreateToolType.SELECT_CURRENT_I:
    case CreateToolType.SELECT_NEXT_I:
      return Piece.I;
    case CreateToolType.SELECT_CURRENT_O:
    case CreateToolType.SELECT_NEXT_O:
      return Piece.O;
    case CreateToolType.SELECT_CURRENT_S:
    case CreateToolType.SELECT_NEXT_S:
      return Piece.S;
    case CreateToolType.SELECT_CURRENT_Z:
    case CreateToolType.SELECT_NEXT_Z:
      return Piece.Z;
    case CreateToolType.SELECT_CURRENT_J:
    case CreateToolType.SELECT_NEXT_J:
      return Piece.J;
    case CreateToolType.SELECT_CURRENT_L:
    case CreateToolType.SELECT_NEXT_L:
      return Piece.L;
    default:
      throw new Error('Unknown type to turn to piece');
  }
}

const getInstructions = (tool: CreateToolType): JSX.Element => {
  switch (tool) {
    case CreateToolType.ADD_COLUMNS:
      return <div>
        <p>Hover your mouse over the grid. You'll see semi-transparent blocks all the way up the column you're hovering over</p>
        <p>Click (or drag) to set those columns into place. Use this tool for broad strokes to get your stack in the right kind of shape, and use the "Toggle Block" tool for precise changes</p>
      </div>;
    case CreateToolType.TOGGLE_BLOCKS:
      return <div>
        <p>Hover your mouse over individual blocks. You'll se semi-transparent blocks on the specific block you're hovering over</p>
        <p>Click (or drag) to toggle individual blocks on order off. Use this tool for precise block changes</p>
      </div>;
    case CreateToolType.UPLOAD:
      return <div>
        <p>Use this tool to upload a screenshot of the situation you want to vote on. You can do this from a saved screenshot, or just from your clipboard</p>
        <p>Make sure to crop your image down to just be the stack! If you have a piece falling already, don't worry, it will be removed</p>
      </div>;
    case CreateToolType.SELECT_CURRENT_T:
    case CreateToolType.SELECT_CURRENT_I:
    case CreateToolType.SELECT_CURRENT_O:
    case CreateToolType.SELECT_CURRENT_S:
    case CreateToolType.SELECT_CURRENT_Z:
    case CreateToolType.SELECT_CURRENT_J:
    case CreateToolType.SELECT_CURRENT_L:
      return <div>
        <p>Select the "current" piece that you have to place</p>
        <p>This is the piece that we will generate all of the possibilities to vote on</p>
      </div>;
    case CreateToolType.SELECT_NEXT_T:
    case CreateToolType.SELECT_NEXT_I:
    case CreateToolType.SELECT_NEXT_O:
    case CreateToolType.SELECT_NEXT_S:
    case CreateToolType.SELECT_NEXT_Z:
    case CreateToolType.SELECT_NEXT_J:
    case CreateToolType.SELECT_NEXT_L:
      return <div>
        <p>Select the "next" piece that is known in your situation</p>
        <p>This could affect potential adjustments for the current piece</p>
      </div>;
    default:
      throw new Error('Unknown tool type');
  }
};

function Create({ createBoard }: { createBoard: (grid: Grid, currentPiece: Piece, nextPiece: Piece) => void }) {
  const [tool, setTool] = useState<CreateToolType>(getDefaultTool(CreateMode.SET_GRID));
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);

  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  let toolList;
  let onToolSelect: (tool: CreateToolType) => void;
  switch (mapToolToMode(tool)) {
    case CreateMode.SET_GRID:
      toolList = setGridTools;
      onToolSelect = setTool;
      break;
    case CreateMode.SELECT_CURRENT_PIECE:
      toolList = setCurrentTools;
      onToolSelect = (tool: CreateToolType) => { setTool(tool); setCurrentPiece(getPieceFromTool(tool)); };
      break;
    case CreateMode.SELECT_NEXT_PIECE:
      toolList = setNextTools;
      onToolSelect = (tool: CreateToolType) => { setTool(tool); setNextPiece(getPieceFromTool(tool)); };
      break;
    default:
      throw new Error('Unknown mode');
  }

  const toolRender = toolList.map(variant => <CreateTool variant={variant} setTool={onToolSelect} selected={variant === tool} />);
  const canCreate = currentPiece !== null && nextPiece !== null;
  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-4">
        <Col xs={4}>
          <Card>
            <Card.Body>
              <Card.Title>Instructions</Card.Title>
              <Card.Text>{getInstructions(tool)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <div className="tetris-grid-wrapper">
            <img className="current-text" src={current} />
            <CreateGrid state={mapToolToMode(tool) === CreateMode.SET_GRID ? tool : null} setState={setTool} grid={grid} setGrid={setGrid} />
            <PieceSelect className="current-piece" piece={currentPiece} active={mapToolToMode(tool) === CreateMode.SELECT_CURRENT_PIECE} onClick={() => setTool(CreateToolType.SELECT_CURRENT_T)} />
            <PieceSelect className="next-piece-create" piece={nextPiece} active={mapToolToMode(tool) === CreateMode.SELECT_NEXT_PIECE} onClick={() => setTool(CreateToolType.SELECT_NEXT_T)} />
            <Button disabled={!canCreate} className="create-button" onClick={() => canCreate && createBoard(grid, currentPiece!, nextPiece!)}>Create</Button>
          </div>
        </Col>
        <Col xs={3}>
          {
            mapToolToMode(tool) !== CreateMode.SET_GRID
              ? <CardColumns>{toolRender}</CardColumns>
              : toolRender
          }
        </Col>
      </Row>
      <Row>
      </Row>
    </Container>
  );
}

export default Create;
