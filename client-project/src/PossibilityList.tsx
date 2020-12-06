import React, { useEffect, useRef } from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { Col, ListGroup } from 'react-bootstrap';

interface PossibilityListProps {
  possibilities: Possibility[];
  voteSortedPossibilities: Possibility[];
  selected: Possibility | null;
  votedFor: Possibility | null;
  setSelected: (index: number) => void;
  showVote: () => void;
}

function PossibilityList({ possibilities, voteSortedPossibilities, selected, setSelected, showVote, votedFor }: PossibilityListProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selected]);

  if (!votedFor) {
    return <ListGroup className="overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => {
        const isSelected = !!selected && selected.id === possibility.id;
        return (
          <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setSelected(possibilities.findIndex(p => p.id === possibility.id))}>
            <div ref={isSelected ? selectedRef : undefined} className="row-fluid">
              <span>{ possibilityDescriber(possibility) }</span>
              { isSelected ? <button onClick={showVote}>Vote</button> : undefined}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>;
  } else {
    const totalVotes = voteSortedPossibilities.reduce((x, y) => x + y.votes, 0);
    return <ListGroup className="overflow-auto possibility-list col-6 container">
      { voteSortedPossibilities.map(possibility => {
        const isSelected = !!selected && selected.id === possibility.id;
        return (
          <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setSelected(possibilities.findIndex(p => p.id === possibility.id))}>
            <div ref={isSelected ? selectedRef : undefined} className="row-fluid">
              <span>{ possibilityDescriber(possibility) }</span>
              <Col className="justify-content-end" xs={4}>{ possibility.votes } votes, { Math.round(possibility.votes * 100 / totalVotes) }%</Col>
              { isSelected ? <button onClick={showVote}>Vote</button> : undefined}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>;
  }
}

export default PossibilityList;
