import { Grid, Piece } from 'nes-tetris-representation';
import React, { useRef, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import inputHandler from './input-handler';
import _ from 'lodash';
import CreateGrid from './CreateGrid';
import current from './current-text.png';
import PieceSelect from './PieceSelect';

export enum CreateState {
  CHOOSE_COLUMNS,
  TOGGLE_HOLES,
};

const emptyGrid: Grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

function Create({ createBoard }: { createBoard: (grid: Grid, currentPiece: Piece, nextPiece: Piece) => void }) {
  const [state, setState] = useState<CreateState>(CreateState.CHOOSE_COLUMNS);
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [currentPiece, setCurrentPiece] = useState<Piece>(Piece.T);
  const [nextPiece, setNextPiece] = useState<Piece>(Piece.T);

  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const toggleCreateGridState = () => state === CreateState.CHOOSE_COLUMNS ?
    setState(CreateState.TOGGLE_HOLES) :
    state === CreateState.TOGGLE_HOLES ?
      setState(CreateState.CHOOSE_COLUMNS) :
      undefined;
  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2}>
          <div className="tetris-grid-wrapper">
            <img className="current-text" src={current} />
            <CreateGrid state={state} grid={grid} setGrid={setGrid} />
          </div>
          <Form.Check
            type="switch"
            id="toggle-switch"
            className="toggle-switch"
            onClick={toggleCreateGridState}
            label={state === CreateState.CHOOSE_COLUMNS ? 'Toggle holes' : 'Pick columns'}
          />
        </Col>
        <Col xs={2}>
          <PieceSelect className="current-piece-select" piece={currentPiece} setPiece={setCurrentPiece} />
          <PieceSelect className="next-piece-select" piece={nextPiece} setPiece={setNextPiece} />
        </Col>
      </Row>
      <Row>
        <button onClick={() => createBoard(grid, currentPiece, nextPiece)}>Save</button>
      </Row>
    </Container>
  );
}

export default Create;
