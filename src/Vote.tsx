import React, { useEffect, useRef, useState } from 'react';
import { ColumnIndex, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './input-handler';
import describer from './possibility-describer';
import { Col, Container, Row, Button } from 'react-bootstrap';
import selectNextOrientation from './selectNextOrientation';
import VoteSummary from './VoteSummary';
import { ShareAndroidIcon } from '@primer/octicons-react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import KeyboardShortcuts, { KeyboardShortcutVariant } from './KeyboardShortcuts';
import { isXsOrSmaller } from './media-queries';

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
  const [loading, setLoading] = useState<boolean>(false);

  const location = useLocation();
  const history = useHistory();

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
    if (!possibility || (votedFor && votedFor.id === possibility.id)) {
      return;
    }

    if (showVote) {
      const votedId = votedFor && votedFor.id;
      const possibilityId = possibility && possibility.id;
      setLoading(true);
      await voteFor(votedId === possibilityId ? null : possibility);
      setLoading(false);
      setJustVoted(true);
    }

    setShowVote(!showVote);
  };

  const [showCopied, setShowCopied] = useState<boolean>(false);
  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = `https://nes-tetris-voter.herokuapp.com${location.pathname}?id=${board.id}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setShowCopied(true);
  }

  const handler = (event: React.KeyboardEvent<HTMLDivElement>) => inputHandler({
    Escape: showVote ? () => setShowVote(false) : removeConsiderations,
    w: !votedFor ? nextOrientation(Orientation.Up) : undefined,
    a: !votedFor ? nextOrientation(Orientation.Left) : undefined,
    s: !votedFor ? nextOrientation(Orientation.Down) : undefined,
    d: !votedFor ? nextOrientation(Orientation.Right) : undefined,
    n: () => history.push('/vote'),
    c: copyToClipboard,
    arrowup,
    arrowdown,
    enter: onEnter,
  }, event);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [true]);

  const isXsSmall = isXsOrSmaller();

  return (
    <Container tabIndex={-1} style={{ outline: 'none' }} ref={ref} onKeyDown={handler} fluid>
      <Row className="mt-4 flex-row fluid board-title-container">
        <h3 className="board-title">Board #{board.id}</h3>
        <div className="board-title-buttons">
          <Link to="/vote">
            <Button variant="outline-primary" style={{ marginRight: '4px' }}>{
              isXsSmall ? 'New' : 'Fetch new scenario'
            }</Button>
          </Link>
          <Button variant="outline-primary" onClick={copyToClipboard}>
            <span style={{ marginRight: '4px' }}>{ showCopied ? 'Copied!' : isXsSmall ? 'Copy' : 'Copy link to clipboard' }</span>
            { !showCopied ? <ShareAndroidIcon size={16} /> : undefined }
          </Button>
        </div>
      </Row>
      <Row className="flex-row fluid align-items-center justify-content-center">
        <Col xs={12} sm={6} xl={{ span: 5, offset: 1 }}>
          <h4 className="d-none d-lg-block">Grid Preview</h4>
          <p className="d-none d-lg-block" style={{ maxWidth: '30rem' }}>
            Hover over potential placements to see what they look like. Use the WASD keys to prefer an orientation and cycle through possibilities
          </p>
          <ChoiceGrid
            grid={board.board}
            possibility={possibility}
            nextPiece={board.nextPiece}
            freezeHover={votedFor !== null}
            setConsideredRowColumn={setFirstConsideredRowColumn}
            onClick={() => setShowVote(true)}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Col xs={12}>
            <h4 className="d-none d-lg-block">{votedFor ? 'Top Rated Placements' : 'Placement List'}</h4>
            <p className="d-none d-lg-block">{ votedFor
              ? 'Here are the top 3 placements according to other votes (and yours)'
              : 'Select the placement in this list that you think is the best move'
            }</p>
          </Col>
          <Col xs={12} xl={9}>
            {
              votedFor ? <VoteSummary
                possibilities={board.possibilities}
                votedFor={votedFor}
                grid={board.board}
                previewedPossibility={possibility}
                previewPossibility={selectPossibility}
                changeVote={() => setShowVote(true)}
              /> : <PossibilityList
                possibilities={board.possibilities}
                selected={possibility}
                showVote={() => setShowVote(true)}
                setPossibility={selectPossibility}
              />
            }
          </Col>
        </Col>
      </Row>
      <KeyboardShortcuts className="d-none d-lg-block" variant={KeyboardShortcutVariant.VOTE} />
      <ConfirmVote
        description={possibility ? describer(possibility) : undefined}
        show={showVote}
        vote={onEnter}
        loading={loading}
        cancel={() => setShowVote(false)}
      />
    </Container>
  );
}

export default Vote;
