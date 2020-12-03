import { gql, useLazyQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Board } from './CommonModels';
import Vote from './Vote';

const GET_BOARD_QUERY = gql`
  query getBoard($id: String) {
    board(id: $id) {
      id,
      board,
      currentPiece,
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

function VotePage() {
  let { id } = useParams<{ id?: string }>();
  const [getBoard, { data, loading }] = useLazyQuery<{ board: Board }, { id?: string }>(GET_BOARD_QUERY);
  if (loading) {
    return <span>Loading a scenario...</span>;
  }

  const board = data && data.board;

  if (board) {
    return <Vote board={board} />
  }

  getBoard({ variables: { id }});

  return <span>Error: Unknown scenario. Please refresh and try again</span>;
}

export default VotePage;
