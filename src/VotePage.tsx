import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [votedFor, setVotedFor] = useState<Possibility | null>(null);
  const [getBoard, { data, loading, error, refetch }] = useLazyQuery<{ board: Board }, { id: string }>(GET_BOARD_QUERY);
  const [getRandomBoard, { data: randomData, loading: randomLoading, error: randomError, refetch: randomRefetch }] = useLazyQuery<{ randomBoard: Board }, { exclude: string[] }>(GET_RANDOM_BOARD_QUERY);
  const [addVote] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote] = useMutation<VoteData>(REMOVE_VOTE);

  const id = query.get('id');
  const adjustedGetBoard = id === null
    ? () => getRandomBoard({ variables: { exclude: storageHandler.getVoted() } })
    : () => getBoard({ variables: { id }});
  const adjustedData = id === null
    ? randomData && randomData.randomBoard
    : data && data.board;
  const adjustedLoading = id === null ? randomLoading : loading;
  const adjustedError = id === null ? randomError : error;
  const adjustedRefetch = id === null ? randomRefetch : refetch;

  if (adjustedError) {
    return <ErrorPage message={adjustedError.message} />;
  }

  if (adjustedLoading) {
    const message = id === null ? 'Loading Random Scenario' : undefined;
    return <Loading message={message} />;
  }

  if (adjustedData) {
    const vote = async (newVoteFor: Possibility | null) => {
      if (votedFor === newVoteFor) {
        return;
      }

      if (votedFor) {
        await removeVote({ variables: { id: votedFor.id }});
      }

      if (newVoteFor) {
        storageHandler.vote(adjustedData, newVoteFor);
        await addVote({ variables: { id: newVoteFor.id }})
      }

      setVotedFor(newVoteFor);
      await adjustedRefetch!({ id: adjustedData.id });
    };

    let storageVotedFor = storageHandler.getVote(adjustedData.id);
    const storagePossibility = storageVotedFor !== null ? adjustedData.possibilities.find(p => p.id === storageVotedFor) : undefined;
    return <Vote board={adjustedData} voteFor={vote} votedFor={storagePossibility || votedFor} />
  }

  adjustedGetBoard();

  return <span>Error: Unknown scenario. Please refresh and try again</span>;
}

export default VotePage;
