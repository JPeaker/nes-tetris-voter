import React, { useEffect, useState } from 'react';
import { ColumnIndex, getPiece, getPieceGrid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './input-handler';
import describer from './possibility-describer';
import { Col, Container, Row } from 'react-bootstrap';
import { TetrisGrid } from 'nes-tetris-components';

type ConsideredPlacement = {
  row?: RowIndex,
  column?: ColumnIndex,
  orientation?: Orientation,
  // If orientation is set, this will tell us _which_ of that orientation to consider. If it's not set, just use the full list that matches row+col
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

  const possibility = board.possibilities[consideredPlacement.index !== undefined ? consideredPlacement.index : 0];
  const removeConsiderations = () => {
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index: undefined });
  };

  const nextOrientation = (orientation: Orientation) => () => {
    if (!possibility) {
      return;
    }

    const currentIndex = board.possibilities.findIndex(p => p.id === possibility.id);
    // It's easy if we don't have to worry about rows and columns
    if (consideredPlacement.row === undefined && consideredPlacement.column === undefined) {
      const listRemainder = board.possibilities.slice(currentIndex + 1);
      const remainderIndex = listRemainder.findIndex(p =>
        (!consideredPlacement.row && !consideredPlacement.column || (p.row === consideredPlacement.row && p.column === consideredPlacement.column)) &&
        p.orientation === orientation
      );

      let index = remainderIndex === -1 ? currentIndex : currentIndex + remainderIndex + 1;

      if (index === currentIndex) {
        index = board.possibilities.findIndex(p => p.orientation === orientation);
      }

      setConsideredPlacement({ ...consideredPlacement, row: undefined, column: undefined, orientation, index });
    }
    else {
      const filteredPossibilities = board.possibilities.filter(p =>
        p.orientation === orientation &&
        p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));
      let index: number;

      if (filteredPossibilities.length === 0) {
        const possibilitiesFilteredWithJustRowColumnFromCurrent = board.possibilities.slice(currentIndex + 1).filter(p =>
          p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));

        if (possibilitiesFilteredWithJustRowColumnFromCurrent.length > 0) {
          index = board.possibilities.findIndex(p => p.id === possibilitiesFilteredWithJustRowColumnFromCurrent[0].id);
          console.log(index);
        } else {
          const possibilitiesFilteredWithJustRowColumn = board.possibilities.filter(p =>
            p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));
          if (possibilitiesFilteredWithJustRowColumn.length > 0) {
            index = board.possibilities.findIndex(p => p.id === possibilitiesFilteredWithJustRowColumn[0].id);
          } else {
            index = possibility ? board.possibilities.findIndex(p => p.id === possibility.id) : 0;
          }
        }
      } else {
        const adjustedPossibilityIndex = possibility ? filteredPossibilities.findIndex(p => p.id === possibility.id) : 0;
        if (adjustedPossibilityIndex === -1) {
          index = board.possibilities.findIndex(p => p.id === filteredPossibilities[0].id);

          if (index === -1) {
            index = consideredPlacement.index || 0;
          }
        } else {
          if (adjustedPossibilityIndex === filteredPossibilities.length - 1) {
            index = board.possibilities.findIndex(p => p.id === filteredPossibilities[0].id);
          } else {
            index = board.possibilities.findIndex(p => p.id === filteredPossibilities[adjustedPossibilityIndex + 1].id);
          }
        }
      }

      setConsideredPlacement({ ...consideredPlacement, orientation, index });
    }
  };

  const up = () => {
    const index = consideredPlacement.index === undefined ? 0 : consideredPlacement.index === 0 ? 0 : consideredPlacement.index - 1;
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index });
  };

  const down = () => {
    const index = consideredPlacement.index === undefined ? 1 : consideredPlacement.index === board.possibilities.length - 1 ? board.possibilities.length - 1 : consideredPlacement.index + 1;
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined, index });
  };

  const vote = (possibility: Possibility | null) => {
    voteFor(possibility);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      Escape: showVote ? () => setShowVote(false) : removeConsiderations,
      KeyW: nextOrientation(Orientation.Up),
      KeyA: nextOrientation(Orientation.Left),
      KeyS: nextOrientation(Orientation.Down),
      KeyD: nextOrientation(Orientation.Right),
      ArrowUp: up,
      ArrowDown: down,
      Enter: () => !possibility ? undefined : showVote ? vote(possibility) : setShowVote(true),
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  const setFirstConsideredRowColumn = (row: RowIndex, column: ColumnIndex) => {
    const index = board.possibilities.findIndex(p =>
      p.blocks.some(block => block.row === row && block.column === column) &&
      (!consideredPlacement.orientation || p.orientation === consideredPlacement.orientation)
    );

    setConsideredPlacement({ ...consideredPlacement, row, column, index });
  }

  return (
    <Container fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2} />
        <Col xs={3}>
          <ChoiceGrid
            grid={board.board}
            possibility={possibility}
            setConsideredRowColumn={setFirstConsideredRowColumn}
            onMouseLeave={() => setConsideredPlacement({ ...consideredPlacement, row: undefined, column: undefined, index: 0 })}
            onClick={() => setShowVote(true)}
          />
        </Col>
        <Col xs={1}>
          NEXT:
          <TetrisGrid grid={getPieceGrid(board.nextPiece)} hideTopTwoRows={false} blockSizeInRem={1.5} className="tetris-grid" />
        </Col>
        <Col xs={4}>
          <PossibilityList
            possibilities={board.possibilities}
            selected={possibility}
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
        description={possibility ? describer(possibility) : undefined}
        show={null !== null}
        vote={() => vote(possibility)}
        cancel={removeConsiderations}
      />
    </Container>
  );
}

export default Vote;
