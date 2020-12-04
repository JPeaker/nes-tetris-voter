import React, { useEffect, useState } from 'react';
import { ColumnIndex, getPiece, getPieceGrid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './vote-input-handler';
import describer from './possibility-describer';
import { Col, Container, Row } from 'react-bootstrap';
import { TetrisGrid } from 'nes-tetris-components';

export type ConsideredPlacement = { row?: RowIndex, column?: ColumnIndex, orientation?: Orientation };

interface VoteProps {
  board: Board,
  voteFor: (possibility: Possibility | null) => void,
  votedFor: Possibility | null
};

function Vote({ board, voteFor, votedFor }: VoteProps) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>({});
  const [consideredPossibilityIndex, setConsideredPossibilityIndex] = useState<number>(0);
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);

  const modifiedSetSelected = (possibility: Possibility | null) => {
    setSelectedPossibility(possibility);
    setConsideredPossibilityIndex(0);
  }

  const consideredPossibilities = board.possibilities.filter(possibility =>
    !consideredPlacement.row && !consideredPlacement.column ||
    (
      (consideredPlacement.orientation === undefined || consideredPlacement.orientation === possibility.orientation) &&
      possibility.blocks.some(block => consideredPlacement.row === block.row && consideredPlacement.column === block.column)
    )
  );

  const removeConsiderations = () => {
    modifiedSetSelected(null);
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined });
  };

  const prefer = (orientation: Orientation) => () => {
    if (consideredPlacement.orientation === orientation && consideredPossibilities.length > 0) {
      setConsideredPossibilityIndex(consideredPossibilityIndex + 1);
    } else {
      setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation });
      setSelectedPossibility(null);
    }
  };

  const scrollDownConsiderations = () => {
    if (consideredPossibilityIndex > 0) {
      setConsideredPossibilityIndex(consideredPossibilityIndex - 1);
    }
    setSelectedPossibility(null);
  };
  const scrollUpConsiderations = () => {
    setConsideredPossibilityIndex(consideredPossibilityIndex + 1);
    setSelectedPossibility(null);
  };

  const vote = (possibility: Possibility | null) => {
    voteFor(possibility);
    setSelectedPossibility(null);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      Escape: removeConsiderations,
      KeyW: prefer(Orientation.Up),
      KeyA: prefer(Orientation.Left),
      KeyS: prefer(Orientation.Down),
      KeyD: prefer(Orientation.Right),
      ArrowUp: scrollDownConsiderations,
      ArrowDown: scrollUpConsiderations,
      Enter: () => selectedPossibility ? vote(selectedPossibility) : undefined,
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  const consideredPossibility = consideredPossibilities[consideredPossibilityIndex % consideredPossibilities.length];

  return (
    <Container fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2} />
        <Col xs={3}>
          <ChoiceGrid
            grid={board.board}
            possibilities={board.possibilities}
            possibilityToRender={votedFor || selectedPossibility || consideredPossibility}
            consideredPlacement={consideredPlacement}
            setConsideredPlacement={selectedPossibility ? undefined : setConsideredPlacement}
            setSelected={selectedPossibility ? undefined : modifiedSetSelected}
          />
        </Col>
        <Col xs={1}>
          NEXT:
          <TetrisGrid grid={getPieceGrid(board.nextPiece)} hideTopTwoRows={false} blockSizeInRem={1.5} className="tetris-grid" />
        </Col>
        <Col xs={4}>
          <PossibilityList
            possibilities={consideredPossibilities}
            considered={consideredPossibility}
            selected={selectedPossibility}
            votedFor={votedFor}
            setSelected={setConsideredPlacement}
          />
        </Col>
        <Col xs={2} />
        {/* <Col>
          <button disabled={selectedPossibility === null} onClick={() => modifiedSetSelected(null)}>Clear Choice</button>
        </Col> */}
      </Row>
      <ConfirmVote
        description={selectedPossibility ? describer(selectedPossibility) : undefined}
        show={selectedPossibility !== null}
        vote={() => vote(selectedPossibility)}
        cancel={removeConsiderations}
      />
    </Container>
  );
}

export default Vote;
