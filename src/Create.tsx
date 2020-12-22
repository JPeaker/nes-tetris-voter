import { Grid, Piece } from 'nes-tetris-representation';
import React, { useRef, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import inputHandler from './input-handler';
import _ from 'lodash';
import CreateGrid from './CreateGrid';
import current from './current-text.png';
import { emptyGrid } from './emptyGrid';
import CreateTool, { CreateToolType } from './CreateTool';

export enum CreateMode {
  SET_GRID,
  SELECT_CURRENT_PIECE,
  SELECT_NEXT_PIECE,
};

const mapToolToMode = (tool: CreateToolType) => {
  switch (tool) {
    case CreateToolType.ADD_COLUMNS:
    case CreateToolType.TOGGLE_BLOCKS:
    case CreateToolType.UPLOAD:
      return CreateMode.SET_GRID;
    default:
      return CreateMode.SET_GRID;
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

  const setGridTools = [
    CreateToolType.ADD_COLUMNS,
    CreateToolType.TOGGLE_BLOCKS,
    CreateToolType.UPLOAD,
  ];

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row>
        <Col xs={4}>
          <div className="tetris-grid-wrapper">
            <img className="current-text" src={current} />
            <CreateGrid state={mapToolToMode(tool) === CreateMode.SET_GRID ? tool : null} grid={grid} setGrid={setGrid} />
          </div>
        </Col>
        <Col xs={4}>
          <h4>Tools</h4>
          <Row>{setGridTools.map(variant => <Col xs={12}><CreateTool variant={variant} setTool={setTool} selected={variant === tool} /></Col>)}</Row>
        </Col>
      </Row>
      <Row>
        <button onClick={() => currentPiece && nextPiece && createBoard(grid, currentPiece, nextPiece)}>Save</button>
      </Row>
    </Container>
  );
}

export default Create;
