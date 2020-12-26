import { BlockValue, filledGrid, Grid, Piece } from 'nes-tetris-representation';
import React, { useRef, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Button, CardColumns, ListGroup } from 'react-bootstrap';
import inputHandler from './input-handler';
import _ from 'lodash';
import CreateGrid from './CreateGrid';
import current from './current-text.png';
import { emptyGrid } from './emptyGrid';
import CreateTool, { CreateToolType } from './CreateTool';
import PieceSelect from './PieceSelect';
import Upload from './Upload';
import './Create.css';
import { XIcon, CheckIcon } from '@primer/octicons-react';

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
      return <Card.Text>
        Hover your mouse over the grid. You'll see semi-transparent blocks all the way up the column you're hovering over
        <br /><br />
        Click (or drag) to set those columns into place. Use this tool for broad strokes to get your stack in the right kind of shape, and use the "Toggle Block" tool for precise changes
      </Card.Text>;
    case CreateToolType.TOGGLE_BLOCKS:
      return <Card.Text>
        Hover your mouse over individual blocks. You'll see semi-transparent blocks on the specific block you're hovering over
        <br /><br />
        Click (or drag) to toggle individual blocks on order off. Use this tool for precise block changes
      </Card.Text>;
    case CreateToolType.UPLOAD:
      return <Card.Text>
        Use this tool to upload a screenshot of the situation you want to vote on. You can do this from a saved screenshot, or just from your clipboard
        <br /><br />
        Make sure to crop your image down to just be the stack! If you have a piece falling already, don't worry, it will be removed
      </Card.Text>;
    case CreateToolType.SELECT_CURRENT_T:
    case CreateToolType.SELECT_CURRENT_I:
    case CreateToolType.SELECT_CURRENT_O:
    case CreateToolType.SELECT_CURRENT_S:
    case CreateToolType.SELECT_CURRENT_Z:
    case CreateToolType.SELECT_CURRENT_J:
    case CreateToolType.SELECT_CURRENT_L:
      return <Card.Text>
        Select the "current" piece that you have to place
        <br /><br />
        This is the piece that we will generate all of the possibilities to vote on
      </Card.Text>;
    case CreateToolType.SELECT_NEXT_T:
    case CreateToolType.SELECT_NEXT_I:
    case CreateToolType.SELECT_NEXT_O:
    case CreateToolType.SELECT_NEXT_S:
    case CreateToolType.SELECT_NEXT_Z:
    case CreateToolType.SELECT_NEXT_J:
    case CreateToolType.SELECT_NEXT_L:
      return <Card.Text>
        Select the "next" piece that is known in your situation
        <br /><br />
        This could affect potential adjustments for the current piece
      </Card.Text>;
    default:
      throw new Error('Unknown tool type');
  }
};

function Create({ createBoard }: { createBoard: (grid: Grid, currentPiece: Piece, nextPiece: Piece) => void }) {
  const [tool, setTool] = useState<CreateToolType>(getDefaultTool(CreateMode.SET_GRID));
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [focusedColumn, focusOnColumn] = useState<number | null>(null);

  const inputFocusColumn = (column: number) => () => {
    if (column >= 0 && column < 10) {
      setTool(CreateToolType.ADD_COLUMNS);
      focusOnColumn(column);
    }
  };

  const increaseFocusedColumn = (count: number) => () => {
    if (focusedColumn !== null) {
      setTool(CreateToolType.ADD_COLUMNS);
      const adjustedGrid = _.cloneDeep(grid);
      let highestIndex = adjustedGrid.map(row => row[focusedColumn]).findIndex(block => block !== BlockValue.EMPTY);
      if (highestIndex === -1) {
        highestIndex = 22;
      } else if (highestIndex <= 0) {
        highestIndex = 1;
      }

      for (let i = highestIndex; i > Math.max(highestIndex - count, 0); i--) {
        adjustedGrid[i - 1][focusedColumn] = filledGrid[i - 1][focusedColumn];
      }
      setGrid(adjustedGrid);
    }
  };

  const decreaseFocusedColumn = (count: number) => () => {
    if (focusedColumn !== null) {
      setTool(CreateToolType.ADD_COLUMNS);
      const adjustedGrid = _.cloneDeep(grid);
      let highestIndex = adjustedGrid.map(row => row[focusedColumn]).findIndex(block => block !== BlockValue.EMPTY);
      if (highestIndex === -1) {
        highestIndex = 21;
      }

      for (let i = highestIndex; i < Math.min(highestIndex + count, 22); i++) {
        adjustedGrid[i][focusedColumn] = BlockValue.EMPTY;
      }

      adjustedGrid[highestIndex][focusedColumn] = BlockValue.EMPTY;
      setGrid(adjustedGrid);
    }
  };

  const hasFullRow = grid.some(row => row.every(block => block !== BlockValue.EMPTY));
  const canCreate = !hasFullRow && currentPiece !== null && nextPiece !== null;

  const pieceHandler = (piece: Piece, currentTool: CreateToolType, nextTool: CreateToolType) => () => {
    const mode = mapToolToMode(tool);
    if (mode === CreateMode.SELECT_CURRENT_PIECE) {
      setTool(currentTool);
      setCurrentPiece(piece);
    } else if (mode === CreateMode.SELECT_NEXT_PIECE) {
      setTool(nextTool);
      setNextPiece(piece);
    }
  };
  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
    q: () => setTool(CreateToolType.ADD_COLUMNS),
    w: () => setTool(CreateToolType.SELECT_CURRENT_T),
    e: () => setTool(CreateToolType.SELECT_NEXT_T),
    1: inputFocusColumn(0),
    2: inputFocusColumn(1),
    3: inputFocusColumn(2),
    4: inputFocusColumn(3),
    5: inputFocusColumn(4),
    6: inputFocusColumn(5),
    7: inputFocusColumn(6),
    8: inputFocusColumn(7),
    9: inputFocusColumn(8),
    0: inputFocusColumn(9),
    arrowup: increaseFocusedColumn(1),
    pageup: increaseFocusedColumn(5),
    arrowdown: decreaseFocusedColumn(1),
    pagedown: decreaseFocusedColumn(5),
    t: pieceHandler(Piece.T, CreateToolType.SELECT_CURRENT_T, CreateToolType.SELECT_NEXT_T),
    i: pieceHandler(Piece.I, CreateToolType.SELECT_CURRENT_I, CreateToolType.SELECT_NEXT_I),
    o: pieceHandler(Piece.O, CreateToolType.SELECT_CURRENT_O, CreateToolType.SELECT_NEXT_O),
    s: pieceHandler(Piece.S, CreateToolType.SELECT_CURRENT_S, CreateToolType.SELECT_NEXT_S),
    z: pieceHandler(Piece.Z, CreateToolType.SELECT_CURRENT_Z, CreateToolType.SELECT_NEXT_Z),
    j: pieceHandler(Piece.J, CreateToolType.SELECT_CURRENT_J, CreateToolType.SELECT_NEXT_J),
    l: pieceHandler(Piece.L, CreateToolType.SELECT_CURRENT_L, CreateToolType.SELECT_NEXT_L),
    enter: () => { canCreate && createBoard(grid, currentPiece!, nextPiece!) },
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

  const toolRender = toolList.map(variant => <CreateTool key={variant} variant={variant} setTool={onToolSelect} selected={variant === tool} />);
  const mode = mapToolToMode(tool);
  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-4">
        <Col xs={4}>
          <Card>
            <Card.Body>
              <Card.Title>Instructions</Card.Title>
              {getInstructions(tool)}
            </Card.Body>
            <Card.Footer>
              In order to successfully create a scenario, you must:
              <br /><br />
              <div onClick={() => setTool(CreateToolType.ADD_COLUMNS)}>
                { hasFullRow ? <XIcon className="x-icon" size={24} /> : <CheckIcon className="check-icon" size={24} /> }
                <a className="underline" href="#">Have a grid with no full rows</a>
              </div>
              <div onClick={() => setTool(CreateToolType.SELECT_CURRENT_T)}>
                { currentPiece === null ? <XIcon className="x-icon" size={24} /> : <CheckIcon className="check-icon" size={24} /> }
                <a className="underline" href="#">Select a current piece</a>
              </div>
              <div onClick={() => setTool(CreateToolType.SELECT_NEXT_T)}>
                { nextPiece === null ? <XIcon className="x-icon" size={24} /> : <CheckIcon className="check-icon" size={24} /> }
                <a className="underline" href="#">Select a next piece</a>
              </div>
              <Button disabled={!canCreate} className="create-button" onClick={() => canCreate && createBoard(grid, currentPiece!, nextPiece!)}>Create</Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={4}>
          <div className="tetris-grid-wrapper-create">
            <img className="current-text" src={current} />
            <CreateGrid state={mode === CreateMode.SET_GRID ? tool : null} setState={setTool} grid={grid} setGrid={setGrid} />
            <PieceSelect className="current-piece" piece={currentPiece} active={mode === CreateMode.SELECT_CURRENT_PIECE} onClick={() => setTool(CreateToolType.SELECT_CURRENT_T)} />
            <PieceSelect className="next-piece-create" piece={nextPiece} active={mode === CreateMode.SELECT_NEXT_PIECE} onClick={() => setTool(CreateToolType.SELECT_NEXT_T)} />
          </div>
        </Col>
        <Col xs={3}>
          {mode !== CreateMode.SET_GRID ? <CardColumns>{toolRender}</CardColumns> : toolRender}
        </Col>
      </Row>
      <Upload
        show={tool == CreateToolType.UPLOAD}
        hide={() => setTool(CreateToolType.TOGGLE_BLOCKS)}
        submit={(grid: Grid) => {
          setGrid(grid);
          setTool(CreateToolType.TOGGLE_BLOCKS);
        }}
      />
    </Container>
  );
}

export default Create;
