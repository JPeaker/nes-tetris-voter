import React, { useEffect, useRef, useState } from 'react';
import { ColumnIndex, getPieceGrid, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './input-handler';
import describer from './possibility-describer';
import { Col, Container, Row } from 'react-bootstrap';
import { TetrisGrid } from 'nes-tetris-components';
import selectNextOrientation from './selectNextOrientation';

export type ConsideredPlacement = {
  row?: RowIndex,
  column?: ColumnIndex,
  orientation?: Orientation,
  index?: number;
};

interface VoteProps {
  board: Board,
  voteFor: (possibility: Possibility | null) => void,
  votedFor: Possibility | null
};

function Vote({ board, voteFor, votedFor }: VoteProps) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>({});
  const [showVote, setShowVote] = useState<boolean>(false);

  const voteSortedPossibilities = [...board.possibilities].sort((p1, p2) => p2.votes - p1.votes);
  const possibility = board.possibilities[consideredPlacement.index !== undefined ? consideredPlacement.index : 0];
  const removeConsiderations = () => {
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index: undefined });
  };

  const nextOrientation = selectNextOrientation(possibility, board.possibilities, consideredPlacement, setConsideredPlacement);
  const arrowup = () => {
    const index = consideredPlacement.index === undefined ? 0 : consideredPlacement.index === 0 ? 0 : consideredPlacement.index - 1;
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index });
  };

  const arrowupVoted = () => {
    if (!possibility) {
      return;
    }

    let index = voteSortedPossibilities.findIndex(p => p.id === possibility.id) - 1;

    if (index < 0) {
      index = 0;
    }

    const consider = voteSortedPossibilities[index];
    const originalIndex = board.possibilities.findIndex(p => p.id === consider.id);
    setConsideredPlacement({ index: originalIndex });
  };

  const arrowdown = () => {
    const index = consideredPlacement.index === undefined ? 1 : consideredPlacement.index === board.possibilities.length - 1 ? board.possibilities.length - 1 : consideredPlacement.index + 1;
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index });
  };

  const arrowdownVoted = () => {
    if (!possibility) {
      return;
    }

    let index = voteSortedPossibilities.findIndex(p => p.id === possibility.id) + 1;

    if (index >= voteSortedPossibilities.length - 1) {
      index = voteSortedPossibilities.length - 1;
    }

    const consider = voteSortedPossibilities[index];
    const originalIndex = board.possibilities.findIndex(p => p.id === consider.id);
    setConsideredPlacement({ index: originalIndex });
  };

  const vote = (possibility: Possibility | null) => {
    voteFor(possibility);
  };

  const setFirstConsideredRowColumn = (row: RowIndex, column: ColumnIndex) => {
    let index = board.possibilities.findIndex(p =>
      p.blocks.some(block => block.row === row && block.column === column) &&
      (!consideredPlacement.orientation || p.orientation === consideredPlacement.orientation)
    );

    if (index === -1) {
      index = board.possibilities.findIndex(p => p.blocks.some(block => block.row === row && block.column === column));
    }

    setConsideredPlacement({ ...consideredPlacement, row, column, index });
  }

  const onEnter = () => {
    if (!possibility) {
      return;
    }

    if (showVote) {
      vote(possibility);
    }

    setShowVote(!showVote);
  }
  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
    Escape: showVote ? () => setShowVote(false) : removeConsiderations,
    w: !votedFor ? nextOrientation(Orientation.Up) : undefined,
    a: !votedFor ? nextOrientation(Orientation.Left) : undefined,
    s: !votedFor ? nextOrientation(Orientation.Down) : undefined,
    d: !votedFor ? nextOrientation(Orientation.Right) : undefined,
    arrowup: !votedFor ? arrowup : arrowupVoted,
    arrowdown: !votedFor ? arrowdown : arrowdownVoted,
    enter: onEnter,
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2} />
        <Col xs={3}>
          <ChoiceGrid
            grid={board.board}
            possibility={possibility}
            freezeHover={votedFor !== null}
            setConsideredRowColumn={setFirstConsideredRowColumn}
            onClick={() => setShowVote(true)}
          />
        </Col>
        <Col xs={1}>
          NEXT:
          <TetrisGrid grid={getPieceGrid(board.nextPiece)} hideTopTwoRows={false} blockSizeInRem={1.5} className="tetris-grid" />
        </Col>
        <Col xs={6}>
          <PossibilityList
            possibilities={board.possibilities}
            voteSortedPossibilities={voteSortedPossibilities}
            selected={possibility}
            votedFor={votedFor}
            showVote={() => setShowVote(true)}
            setSelected={(index: number) => setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index })}
          />
        </Col>
      </Row>
      <ConfirmVote
        description={possibility ? describer(possibility) : undefined}
        show={showVote}
        vote={() => vote(possibility)}
        cancel={() => setShowVote(false)}
      />
    </Container>
  );
}

export default Vote;
