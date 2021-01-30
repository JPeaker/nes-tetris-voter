import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Board, Possibility } from './CommonModels';
import Vote from './Vote';
import ErrorPage from './ErrorPage';
import Loading from './Loading';
import LocalStorageHandler, { IStorageHandler } from './storage-handler';
const GET_BOARD_QUERY = gql`
  query getBoard($id: String!) {
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

const GET_RANDOM_BOARD_QUERY = gql`
  query getRandomBoard($exclude: [String!]!) {
    randomBoard(exclude: $exclude) {
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

const storageHandler: IStorageHandler = new LocalStorageHandler();

function VotePage() {
  const query = new URLSearchParams(useLocation().search);
  const id = query.get('id');
  const [votedFor, setVotedFor] = useState<Possibility | null>(null);
  const [getBoard, { data, loading, error, refetch }] = useLazyQuery<{ board: Board }, { id: string }>(GET_BOARD_QUERY);
  const [getRandomBoard, { data: randomData, loading: randomLoading, error: randomError }] = useLazyQuery<{ randomBoard: Board }, { exclude: string[] }>(GET_RANDOM_BOARD_QUERY);
  const [addVote] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote] = useMutation<VoteData>(REMOVE_VOTE);


  if (randomLoading) {
    return <Loading message="Loading Random Scenario" />;
  }

  if (randomError) {
    const error = randomError.message === 'No unvoted boards remaining' ? 'It looks like you\'ve voted on every scenario we have. Why not go and create some more?' : randomError.message;
    return <ErrorPage message={error} />;
  }

  if (randomData) {
    return <Redirect to={`/vote?id=${randomData.randomBoard.id}`} />;
  }

  if (!id) {
    getRandomBoard({ variables: { exclude: storageHandler.getVoted() } });
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (data) {
    const vote = async (newVoteFor: Possibility | null) => {
      if (votedFor === newVoteFor) {
        return;
      }

      const adjustedVotedFor = votedFor || data.board.possibilities.find(p => id && p.id === storageHandler.getVote(id));
      if (adjustedVotedFor) {
        await removeVote({ variables: { id: adjustedVotedFor.id }});
      }

      if (newVoteFor) {
        storageHandler.vote(data.board, newVoteFor);
        await addVote({ variables: { id: newVoteFor.id }})
      }

      setVotedFor(newVoteFor);
      await refetch!({ id: data.board.id });
    };

    let storageVotedFor = storageHandler.getVote(data.board.id);
    const storagePossibility = storageVotedFor !== null ? data.board.possibilities.find(p => p.id === storageVotedFor) : undefined;
    return <Vote board={data.board} voteFor={vote} votedFor={storagePossibility || votedFor} />
  }

  getBoard({ variables: { id: id! }});

  return <span>Error: Unknown scenario. Please refresh and try again</span>;
}

export default VotePage;
