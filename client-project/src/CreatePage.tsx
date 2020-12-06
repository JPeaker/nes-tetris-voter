import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Create from './Create';

const CREATE_BOARD = gql`
  mutation createBoard($grid: Grid, $currentPiece: Piece, $nextPiece: Piece) {
    createBoard(grid: $grid, currentPiece: $currentPiece, nextPiece: $nextPiece) {
      id
    }
  }
`;

interface CreateBoardData {
  id: string;
}

function VotePage() {
  const [createBoard, { data, loading, error }] = useMutation<CreateBoardData>(CREATE_BOARD);

  if (error) {
    return <span>{error.message}</span>
  }

  if (loading) {
    return <span>Creating scenario...</span>;
  }

  if (data) {
    useHistory().push(`/vote?id=${data.id}`);
  }

  return <Create />;
}

export default VotePage;
