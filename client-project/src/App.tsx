import React, { useState } from 'react';
import './App.css';
import { ColumnIndex, getPiece, Grid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';

interface Possibility {
  id: string;
  blocks: { row: RowIndex; column: ColumnIndex }[];
  votes: number;
}

interface Board {
  id: string;
  board: Grid;
  currentPiece: Piece;
  possibilities: Possibility[];
}

interface GetBoardsData {
  boards: Board[];
}

interface RandomBoardData {
  randomBoard: Board;
}

const GET_BOARDS_QUERY = gql`
  query getBoards {
    boards {
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
        votes
      }
    }
  }
`;

const GET_RANDOM_BOARD_QUERY = gql`
  query getRandomBoard {
    randomBoard {
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
        votes
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

function App() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);
  const { loading: getBoardsLoading, data: getBoardsData } = useQuery<GetBoardsData>(GET_BOARDS_QUERY);
  const [initGetRandomBoard, { data: randomBoard, refetch: getRandomBoard }] = useLazyQuery<RandomBoardData>(GET_RANDOM_BOARD_QUERY);
  const [addVote, { data: addedVote }] = useMutation<VoteData>(ADD_VOTE);
  const [removeVote, { data: removedVote }] = useMutation<VoteData>(REMOVE_VOTE);

  if (randomBoard && randomBoard.randomBoard && (selectedBoard ? selectedBoard.id !== randomBoard.randomBoard.id : true)) {
    setSelectedBoard(randomBoard.randomBoard);
    setSelectedPossibility(randomBoard.randomBoard.possibilities[0]);
  }

  if (getBoardsLoading) {
    return <>Loading</>;
  }

  const updatedBoard = selectedBoard ? _.cloneDeep(selectedBoard.board) : null;

  if (selectedBoard && updatedBoard) {
    if (!selectedPossibility) {
      setSelectedPossibility(selectedBoard.possibilities[0]);
    }
    const possibility = selectedPossibility || selectedBoard.possibilities[0];
    const piece = getPiece({ row: 2, column: 5, type: selectedBoard.currentPiece, orientation: Orientation.Down });
    possibility.blocks.forEach(({ row, column }) => updatedBoard[row][column] = piece.blocks[0].value);
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.currentTarget.value || null;
    const possibility = selectedBoard && selectedBoard.possibilities.find(p => p.id === id);
    setSelectedPossibility(possibility!);
  };

  const votes = removedVote ? removedVote.votes : addedVote ? addedVote.votes : selectedPossibility ? selectedPossibility.votes : null;

  return (
    <div className="App">
      <ul>
        {
          getBoardsData!.boards.map(board => <li key={board.id} onClick={() => setSelectedBoard(board)}>
            <div>Id: {board.id}</div>
          </li>)
        }
      </ul>
      <button onClick={() => (getRandomBoard || initGetRandomBoard)()}>Randomize!</button>
      { selectedBoard && updatedBoard ? <TetrisGrid beforeGrid={selectedBoard.board} grid={updatedBoard} /> : undefined }
      {
        selectedBoard ? (
          <select defaultValue={selectedPossibility && selectedPossibility.id || undefined} onChange={onChange}>
            { selectedBoard.possibilities.map(possibility =>
              <option key={possibility.id} value={possibility.id}>
                {possibility.blocks.map(block => `{${block.column},${block.row}}`).join(',')}
              </option>)}
          </select>
        ) : undefined
      }
      {
        selectedBoard ? (
          <>
            <div>Votes: {votes}</div>
            <button onClick={() => addVote({ variables: { id: selectedPossibility && selectedPossibility.id }})}>Vote</button>
            <button onClick={() => removeVote({ variables: { id: selectedPossibility && selectedPossibility.id }})}>Unvote</button>
          </>
        ) : undefined
      }
    </div>
  );
}

export default App;
