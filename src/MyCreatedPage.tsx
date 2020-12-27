import { gql, useLazyQuery } from '@apollo/client';
import React from 'react';
import { Board } from './CommonModels';
import MyCreated from './MyCreated';
import LocalStorageHandler, { IStorageHandler } from './storage-handler';

const GET_BOARDS = gql`
  query boards($include: [String!]!) {
    boards(include: $include) {
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

const storageHelper: IStorageHandler = new LocalStorageHandler();

function MyCreatedPage() {
  const [getBoards, { data, loading, error }] = useLazyQuery<{ boards: IndexResult }, { include: string[] }>(GET_BOARDS);

  if (!data && !loading && !error) {
    getBoards({ variables: { include: storageHelper.getCreated() } });
  }

  return <MyCreated boards={data ? data.boards : []} loading={loading} error={error ? error.message : null} />;
}

export default MyCreatedPage;
