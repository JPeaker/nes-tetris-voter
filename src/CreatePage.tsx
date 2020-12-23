import { gql, useMutation } from '@apollo/client';
import { Grid, Piece } from 'nes-tetris-representation';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Create from './Create';
import ErrorPage from './ErrorPage';
import Loading from './Loading';

const CREATE_BOARD = gql`
  mutation createBoard($grid: [[Int!]!]!, $currentPiece: Int!, $nextPiece: Int!) {
    createBoard(board: { board: $grid, currentPiece: $currentPiece, nextPiece: $nextPiece }) {
      id
    }
  }
`;

interface CreateBoardData {
  createBoard: {
    id: number;
  }
}

function VotePage() {
  const [createBoard, { data, loading, error }] = useMutation<CreateBoardData>(CREATE_BOARD);

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (data || loading) {
    if (data) {
      useHistory().push(`/vote?id=${data.createBoard.id}`);
    }

    return <Loading message="Creating..." />
  }

  const createBoardArg = (grid: Grid, currentPiece: Piece, nextPiece: Piece) => createBoard({ variables: {
    grid,
    currentPiece,
    nextPiece
  }});
  return <Create createBoard={createBoardArg} />;
}

export default VotePage;
