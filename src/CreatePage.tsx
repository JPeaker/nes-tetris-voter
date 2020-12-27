import { gql, useMutation } from '@apollo/client';
import { Grid, Piece } from 'nes-tetris-representation';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Create from './Create';
import ErrorPage from './ErrorPage';
import Loading from './Loading';
import LocalStorageHandler, { IStorageHandler } from './storage-handler';

const CREATE_BOARD = gql`
  mutation createBoard($grid: [[Int!]!]!, $currentPiece: Int!, $nextPiece: Int!) {
    createBoard(board: { board: $grid, currentPiece: $currentPiece, nextPiece: $nextPiece }) {
      id
    }
  }
`;

interface CreateBoardData {
  createBoard: {
    id: string;
  }
}

const storageHandler: IStorageHandler = new LocalStorageHandler();

function CreatePage() {
  const [createBoard, { data, loading, error }] = useMutation<CreateBoardData>(CREATE_BOARD);

  if (error) {
    if (error.message.includes('Board exists with id')) {
      const id = error.message.split(':')[1];
      return <Redirect to={`/vote?id=${id}`} />;
    }

    return <ErrorPage message={error.message} />;
  }

  if (data || loading) {
    if (data) {
      useHistory().push(`/vote?id=${data.createBoard.id}`);
    }

    return <Loading message="Creating..." />
  }

  const createBoardArg = async (grid: Grid, currentPiece: Piece, nextPiece: Piece) => {
    const result = await createBoard({ variables: {
      grid,
      currentPiece,
      nextPiece
    }});

    if (result.data) {
      storageHandler.create(result.data.createBoard.id);
    }
  };
  return <Create createBoard={createBoardArg} />;
}

export default CreatePage;
