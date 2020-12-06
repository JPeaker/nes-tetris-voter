import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Board, Possibility } from './CommonModels';
import Vote from './Vote';

const GET_BOARD_QUERY = gql`
  query getBoard($id: String) {
    board(id: $id) {
      id,
      board,
      currentPiece,
      nextPiece,
      createdAt,
      possibilities {
        id,
        blocks {
          row,
          column
        },
        votes,
        type,
        orientation,
        row,
        column,
      }
    }
  }
`;

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

function VotePage() {
  const query = new URLSearchParams(useLocation().search);
  const [votedFor, setVotedFor] = useState<Possibility | null>(null);
  const [getBoard, { data, loading, error, refetch }] = useLazyQuery<{ board: Board }, { id?: string }>(GET_BOARD_QUERY);
  const [addVote] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote] = useMutation<VoteData>(REMOVE_VOTE);

  if (error) {
    return <span>{error.message}</span>
  }

  if (loading) {
    return <span>Loading a scenario...</span>;
  }
  if (data) {
    const vote = (newVoteFor: Possibility | null) => {
      if (votedFor) {
        removeVote({ variables: { id: votedFor.id }});
      }

      if (newVoteFor) {
        addVote({ variables: { id: newVoteFor.id }})
      }

      setVotedFor(newVoteFor);
      refetch!({ id: data.board.id });
    };

    return <Vote board={data.board} voteFor={vote} votedFor={votedFor} />
  }

  getBoard({ variables: { id: query.get('id') || undefined }});

  return <span>Error: Unknown scenario. Please refresh and try again</span>;
}

export default VotePage;
