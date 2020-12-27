import { gql, useLazyQuery } from '@apollo/client';
import React from 'react';
import Browse from './Browse';
import { Board } from './CommonModels';

const GET_MOST_RECENT = gql`
  query mostRecentBoards {
    mostRecentBoards {
      id,
      board,
      createdAt,
      currentPiece,
      nextPiece,
      votes,
    }
  }
`;

const GET_MOST_VOTED = gql`
  query mostVotedBoards {
    mostVotedBoards {
      id,
      board,
      createdAt,
      currentPiece,
      nextPiece,
      votes,
    }
  }
`;

type IndexResult = Omit<Board, 'possibilities'>[];

function BrowsePage() {
  const [getMostRecentBoards, { data: recentData, loading: recentLoading, error: recentError }] = useLazyQuery<{ mostRecentBoards: IndexResult }>(GET_MOST_RECENT);
  const [getMostVotedBoards, { data: votedData, loading: votedLoading, error: votedError }] = useLazyQuery<{ mostVotedBoards: IndexResult }>(GET_MOST_VOTED);

  if (!recentData && !recentLoading && !recentError) {
    getMostRecentBoards();
  }

  if (!votedData && !votedLoading && !votedError) {
    getMostVotedBoards();
  }

  return <Browse
    voted={votedData ? votedData.mostVotedBoards : []}
    recent={recentData ? recentData.mostRecentBoards : []}
    votedError={votedError ? votedError.message : null}
    recentError={recentError ? recentError.message : null}
    votedLoading={votedLoading}
    recentLoading={recentLoading}
  />;
}

export default BrowsePage;
