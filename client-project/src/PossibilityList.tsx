import React from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import { Possibility } from './CommonModels';
import possibilityDescriber from './possibility-describer';
import { TetrisGrid } from 'nes-tetris-components';
import { getPiece, Grid } from 'nes-tetris-representation';
import LazyLoad from 'react-lazyload';

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
    <ul className="list-group overflow-auto">
      { possibilities.map((possibility, index) => (
        <li className={`list-group-item ${selected.id === possibility.id ? 'active' : ''}`} onClick={() => setSelected(possibility)}>
          <LazyLoad height={50} offset={200} unmountIfInvisible>
            <TetrisGrid grid={grid} possiblePiece={getPiece({...possibility, type: possibility.piece})} blockSizeInRem={0.25} />
          </LazyLoad>
          { possibilityDescriber(possibility) }
        </li>
      ))}
    </ul>
  );
}

export default PossibilityList;
