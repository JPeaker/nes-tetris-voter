import React, { useEffect, useState } from 'react';
import { getPiece, getPieceGrid } from 'nes-tetris-representation';
import { Board, Possibility } from './CommonModels';
import ConfirmVote from './ConfirmVote';
import describer from './possibility-describer';
import { Col, Container, Row } from 'react-bootstrap';
import { TetrisGrid } from 'nes-tetris-components';
import VotesList from './VotesList';
import inputHandler from './input-handler';

interface ShowVotesProps {
  board: Board,
  voteFor: (possibility: Possibility | null) => void,
  votedFor: Possibility
};

function ShowVotes({ board, voteFor, votedFor }: ShowVotesProps) {
  const [selected, setSelected] = useState<Possibility>(votedFor);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onEnter = () => {
    if (selected.id !== votedFor.id) {
      if (!showConfirm) {
        setShowConfirm(true);
      } else {
        voteFor(selected);
        setShowConfirm(false);
      }
    }
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      Escape: () => setSelected(votedFor),
      Enter: onEnter,
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  return (
    <Container fluid>
      <Row className="flex-row fluid align-items-center justify-content-center mt-5">
        <Col xs={2} />
        <Col xs={3}>
          <TetrisGrid grid={board.board} possiblePiece={getPiece(selected)} />
        </Col>
        <Col xs={1}>
          NEXT:
          <TetrisGrid grid={getPieceGrid(board.nextPiece)} hideTopTwoRows={false} blockSizeInRem={1.5} className="tetris-grid" />
        </Col>
        <Col xs={1}>
          { selected.id !== votedFor.id ?
            <button onClick={() => setShowConfirm(true)}>Change Vote</button>
          : undefined }
        </Col>
        <Col xs={4}>
          <VotesList possibilities={board.possibilities} selected={selected} setSelected={setSelected} />
        </Col>
        <Col xs={2} />
      </Row>
      <ConfirmVote
        description={selected ? describer(selected) : undefined}
        show={showConfirm}
        vote={() => { voteFor(selected); setShowConfirm(false); }}
        cancel={() => { setSelected(votedFor); setShowConfirm(false); }}
      />
    </Container>
  );
}

export default ShowVotes;
