import React, { useEffect, useRef, useState } from 'react';
import { ColumnIndex, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './input-handler';
import describer from './possibility-describer';
import { Col, Container, Row } from 'react-bootstrap';
import selectNextOrientation from './selectNextOrientation';

export type ConsideredPlacement = {
  placement?: { row: RowIndex, column: ColumnIndex },
  orientation?: Orientation,
  index: number;
};

interface VoteProps {
  board: Board,
  voteFor: (possibility: Possibility | null) => Promise<void>,
  votedFor: Possibility | null
};

function Vote({ board, voteFor, votedFor }: VoteProps) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>({ index: 0 });
  const [showVote, setShowVote] = useState<boolean>(false);
  const [justVoted, setJustVoted] = useState<boolean>(false);

  const voteSortedPossibilities = [...board.possibilities].sort((p1, p2) => p2.votes - p1.votes);
  const consideredProbabilityList = votedFor ? voteSortedPossibilities : board.possibilities;

  const possibility = consideredProbabilityList[consideredPlacement.index !== undefined ? consideredPlacement.index : 0];
  const removeConsiderations = () => {
    setConsideredPlacement({ placement: undefined, orientation: undefined, index: 0 });
  };

  const selectPossibility = (possibility: Possibility) => {
    const index = consideredProbabilityList.findIndex(p => p.id === possibility.id);
    setConsideredPlacement({ index });
  }

  if (justVoted && votedFor) {
    selectPossibility(votedFor);
    setJustVoted(false);
  }

  const nextOrientation = selectNextOrientation(possibility, consideredProbabilityList, consideredPlacement, setConsideredPlacement);
  const arrowup = () => {
    const index = consideredPlacement.index === undefined ? 0 : consideredPlacement.index === 0 ? 0 : consideredPlacement.index - 1;
    setConsideredPlacement({ placement: undefined, orientation: undefined, index });
  };

  const arrowdown = () => {
    const index = consideredPlacement.index === undefined ? 1 : consideredPlacement.index === board.possibilities.length - 1 ? board.possibilities.length - 1 : consideredPlacement.index + 1;
    setConsideredPlacement({ placement: undefined, orientation: undefined, index });
  };

  const setFirstConsideredRowColumn = (row: RowIndex, column: ColumnIndex) => {
    let index = board.possibilities.findIndex(p =>
      p.blocks.some(block => block.row === row && block.column === column) &&
      (!consideredPlacement.orientation || p.orientation === consideredPlacement.orientation)
    );

    if (index === -1) {
      index = board.possibilities.findIndex(p => p.blocks.some(block => block.row === row && block.column === column));
    }

    setConsideredPlacement({ ...consideredPlacement, placement: { row, column }, index });
  }

  const onEnter = async () => {
    if (!possibility) {
      return;
    }

    if (showVote) {
      const votedId = votedFor && votedFor.id;
      const possibilityId = possibility && possibility.id;
      await voteFor(votedId === possibilityId ? null : possibility);
      setJustVoted(true);
    }

    setShowVote(!showVote);
  };

  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
    Escape: showVote ? () => setShowVote(false) : removeConsiderations,
    w: !votedFor ? nextOrientation(Orientation.Up) : undefined,
    a: !votedFor ? nextOrientation(Orientation.Left) : undefined,
    s: !votedFor ? nextOrientation(Orientation.Down) : undefined,
    d: !votedFor ? nextOrientation(Orientation.Right) : undefined,
    arrowup,
    arrowdown,
    enter: onEnter,
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2} />
        <Col xs={3}>
          <ChoiceGrid
            grid={board.board}
            possibility={possibility}
            nextPiece={board.nextPiece}
            freezeHover={votedFor !== null}
            setConsideredRowColumn={setFirstConsideredRowColumn}
            onClick={() => setShowVote(true)}
          />
        </Col>
        <Col xs={6}>
          <PossibilityList
            possibilities={consideredProbabilityList}
            selected={possibility}
            votedFor={votedFor}
            showVote={() => setShowVote(true)}
            setPossibility={(possibility: Possibility) => selectPossibility(possibility)}
          />
        </Col>
      </Row>
      <ConfirmVote
        description={possibility ? describer(possibility) : undefined}
        show={showVote}
        vote={onEnter}
        cancel={() => setShowVote(false)}
      />
    </Container>
  );
}

export default Vote;
