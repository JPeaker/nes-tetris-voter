import React, { useEffect, useRef } from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { Col, ListGroup } from 'react-bootstrap';

interface PossibilityListProps {
  possibilities: Possibility[];
  selected: Possibility | null;
  votedFor: Possibility | null;
  setPossibility: (possibility: Possibility) => void;
  showVote: () => void;
}

function PossibilityList({ possibilities, selected, setPossibility, showVote, votedFor }: PossibilityListProps) {
  const selectedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  });

  const totalVotes = possibilities.reduce((x, y) => x + y.votes, 0);
  return <ListGroup className="overflow-auto possibility-list col-6 container">
    { possibilities.map(possibility => {
      const isSelected = !!selected && selected.id === possibility.id;
      const isVotedFor = !!votedFor && votedFor.id === possibility.id;
      return (
        <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setPossibility(possibility)}>
          <div ref={isSelected ? selectedRef : undefined} className="row-fluid">
            <span>{ possibilityDescriber(possibility) }</span>
            { votedFor ? <Col className="justify-content-end" xs={4}>{ possibility.votes } votes, { Math.round(possibility.votes * 100 / totalVotes) }%</Col> : undefined }
            { isSelected ? <button onClick={showVote}>{ !isVotedFor ? 'Vote' : 'Remove Vote' }</button> : undefined }
          </div>
        </ListGroup.Item>
      );
    })}
  </ListGroup>;
}

export default PossibilityList;
