import React from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { ListGroup } from 'react-bootstrap';

interface PossibilityListProps {
  possibilities: Possibility[];
  selected: Possibility | null;
  votedFor: Possibility | null;
  setSelected: (possibility: Possibility) => void;
}

function PossibilityList({ possibilities, selected, setSelected, votedFor }: PossibilityListProps) {
  return (
    <ListGroup className="overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => {
        const isSelected = !!selected && selected.id === possibility.id;
        return (
          <ListGroup.Item key={possibility.id} active={isSelected} onClick={() => setSelected(possibility)}>
            <div className="row-fluid">
              <span>{ possibilityDescriber(possibility) }</span>
              { votedFor && votedFor.id === possibility.id ? <span>Chosen</span> : undefined}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default PossibilityList;
