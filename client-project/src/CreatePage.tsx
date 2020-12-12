import { gql, useMutation } from '@apollo/client';
import { Grid, Piece } from 'nes-tetris-representation';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Create from './Create';

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
    return <span>{error.message}</span>
  }

  if (loading) {
    return <span>Creating scenario...</span>;
  }

  console.log(data);
  if (data) {
    useHistory().push(`/vote?id=${data.createBoard.id}`);
  }

  const createBoardArg = (grid: Grid, currentPiece: Piece, nextPiece: Piece) => createBoard({ variables: {
    grid,
    currentPiece,
    nextPiece
  }});
  return <Create createBoard={createBoardArg} />;
}

export default VotePage;
