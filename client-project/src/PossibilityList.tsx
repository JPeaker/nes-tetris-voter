import React from 'react';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';

interface PossibilityListProps {
  possibilities: Possibility[];
  selected: Possibility | null;
  votedFor: Possibility | null;
  setSelected: (possibility: Possibility) => void;
}

function PossibilityList({ possibilities, selected, setSelected, votedFor }: PossibilityListProps) {
  return (
    <ul id="possibility-list" className="list-group overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => (
        <li key={possibility.id} className={`list-group-item ${selected && selected.id === possibility.id ? 'active' : ''}`} onClick={() => setSelected(possibility)}>
          <div className="row-fluid">
            <span>{ possibilityDescriber(possibility) }</span>
            { votedFor && votedFor.id === possibility.id ? <span>Chosen</span> : undefined}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PossibilityList;
