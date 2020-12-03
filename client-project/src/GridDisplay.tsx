import React, { useState } from 'react';
import { getPiece, Orientation } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';

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

function VotePage({ board }: { board: Board }) {
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);
  const [addVote, { data: addedVote }] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote, { data: removedVote }] = useMutation<VoteData>(REMOVE_VOTE);

  const updatedBoard = _.cloneDeep(board.board);

  if (!selectedPossibility) {
    setSelectedPossibility(board.possibilities[0]);
  }
  const possibility = selectedPossibility || board.possibilities[0];
  const piece = getPiece({ row: 2, column: 5, type: board.currentPiece, orientation: Orientation.Down });
  possibility.blocks.forEach(({ row, column }) => updatedBoard[row][column] = piece.blocks[0].value);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.currentTarget.value || null;
    const possibility = board && board.possibilities.find(p => p.id === id);
    setSelectedPossibility(possibility!);
  };

  const votes = removedVote ? removedVote.votes : addedVote ? addedVote.votes : selectedPossibility ? selectedPossibility.votes : null;

  return (
    <div className="App">
      <TetrisGrid beforeGrid={board.board} grid={updatedBoard} />
      <select defaultValue={selectedPossibility && selectedPossibility.id || undefined} onChange={onChange}>
        { board.possibilities.map(possibility =>
          <option key={possibility.id} value={possibility.id}>
            {possibility.blocks.map(block => `{${block.column},${block.row}}`).join(',')}
          </option>)}
      </select>
      <div>Votes: {votes}</div>
      <button onClick={() => addVote({ variables: { id: selectedPossibility && selectedPossibility.id }})}>Vote</button>
      <button onClick={() => removeVote({ variables: { id: selectedPossibility && selectedPossibility.id }})}>Unvote</button>
    </div>
  );
}

export default VotePage;
