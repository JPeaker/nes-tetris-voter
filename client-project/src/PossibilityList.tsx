import React from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';
import { getPiece, Grid } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import './PossibilityList.css';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';

const ADD_VOTE = gql`
  mutation addVote($id: String!) {
    addVote(id: $id) {
      votes
    }
  }
`;

const REMOVE_VOTE = gql`
  mutation removeVote($id: String!) {
    removeVote(id: $id) {
      votes
    }
  }
`;

interface VoteData {
  votes: number;
}

interface PossibilityListProps {
  grid: Grid;
  possibilities: Possibility[];
  selected: Possibility;
  setSelected: (possibility: Possibility) => void;
}

function PossibilityList({ grid, possibilities, selected, setSelected }: PossibilityListProps) {
  const [addVote] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote] = useMutation<VoteData>(REMOVE_VOTE);

  return (
    <ul id="possibility-list" className="list-group overflow-auto possibility-list col-6 container">
      { possibilities.map(possibility => (
        <li className={`list-group-item ${selected.id === possibility.id ? 'active' : ''}`} onClick={() => setSelected(possibility)}>
          <div className="row-fluid">
            <span className="col-3">
              <LazyLoad offset={200} scrollContainer="#possibility-list" unmountIfInvisible>
                  <TetrisGrid grid={grid} possiblePiece={getPiece(possibility)} blockSizeInRem={0.25} />
              </LazyLoad>
            </span>
            <span>{ possibilityDescriber(possibility) }</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PossibilityList;
