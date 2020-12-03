import React from 'react';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import { Possibility } from './CommonModels';

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
  possibilities: Possibility[];
  selected: Possibility;
  setSelected: (possibility: Possibility) => void;
}

function PossibilityList({ possibilities, selected, setSelected }: PossibilityListProps) {
  const [addVote, { data: addedVote }] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote, { data: removedVote }] = useMutation<VoteData>(REMOVE_VOTE);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.currentTarget.value || null;
    const possibility = possibilities.find(p => p.id === id);
    setSelected(possibility!);
  };

  return (
    <div className="App">
      <select defaultValue={selected.id} onChange={onChange}>
        { possibilities.map(possibility =>
          <option key={possibility.id} value={possibility.id}>
            {possibility.blocks.map(block => `{${block.column},${block.row}}`).join(',')}
          </option>)}
      </select>
      <button onClick={() => addVote({ variables: { id: selected.id }})}>Vote</button>
      <button onClick={() => removeVote({ variables: { id: selected.id }})}>Unvote</button>
    </div>
  );
}

export default PossibilityList;
