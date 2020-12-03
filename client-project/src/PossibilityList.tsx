import React from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';

interface PossibilityListProps {
  possibilities: Possibility[];
  considered: Possibility;
  selected: Possibility | null;
  votedFor: Possibility | null;
  setSelected: (possibility: Possibility) => void;
}

function PossibilityList({ possibilities, selected, setSelected, considered, votedFor }: PossibilityListProps) {
  return (
    <ul id="possibility-list" className="list-group overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => {
        const isSelected = selected && selected.id === possibility.id;
        const isConsidered = considered && considered.id === possibility.id;
        return (
          <li key={possibility.id} className={`list-group-item ${!isConsidered && !isSelected ? 'disabled' : ''} ${isSelected ? 'active' : ''}`} onClick={() => setSelected(possibility)}>
            <div className="row-fluid">
              <span>{ possibilityDescriber(possibility) }</span>
              { votedFor && votedFor.id === possibility.id ? <span>Chosen</span> : undefined}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default PossibilityList;
