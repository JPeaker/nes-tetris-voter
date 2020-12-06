import React, { useEffect, useRef } from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { ListGroup } from 'react-bootstrap';

interface PossibilityListProps {
  possibilities: Possibility[];
  selected: Possibility | null;
  votedFor: Possibility | null;
  setSelected: (index: number) => void;
  showVote: () => void;
}

function PossibilityList({ possibilities, selected, setSelected, showVote, votedFor }: PossibilityListProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selected]);

  return (
    <ListGroup className="overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => {
        const isSelected = !!selected && selected.id === possibility.id;
        return (
          <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setSelected(possibilities.findIndex(p => p.id === possibility.id))}>
            <div ref={isSelected ? selectedRef : undefined} className="row-fluid">
              <span>{ possibilityDescriber(possibility) }</span>
              <span>{ votedFor && votedFor.id === possibility.id ? <span>Chosen</span> : undefined}</span>
              { isSelected ? <button onClick={showVote}>Vote</button> : undefined}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default PossibilityList;
