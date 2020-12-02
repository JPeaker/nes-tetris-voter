import React, { useState } from 'react';
import './App.css';
import { ColumnIndex, getPiece, Grid, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import _ from 'lodash';

interface Possibility {
  blocks: { row: RowIndex; column: ColumnIndex }[];
}

interface Board {
  id: number;
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
        blocks {
          row,
          column
        }
      }
    }
  }
`;

const GET_RANDOM_BOARD_QUERY = gql`
  query getRandomBoard {
    randomBoard {
      id,
      board,
      possibilities {
        blocks {
          row,
          column,
        }
      }
    }
  }
`;

function App() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [possibilityIndex, setPossibilityIndex] = useState<number>(0);
  const { loading: getBoardsLoading, data: getBoardsData } = useQuery<GetBoardsData>(GET_BOARDS_QUERY);
  const [initGetRandomBoard, { data: randomBoard, refetch: getRandomBoard }] = useLazyQuery<RandomBoardData>(GET_RANDOM_BOARD_QUERY, { });

  if (randomBoard && randomBoard.randomBoard && selectedBoard && selectedBoard.id !== randomBoard.randomBoard.id) {
    setSelectedBoard(randomBoard.randomBoard);
  }

  if (getBoardsLoading) {
    return <>Loading</>;
  }

  const updatedBoard = selectedBoard ? _.cloneDeep(selectedBoard.board) : null;

  if (selectedBoard && updatedBoard) {
    const possibility = selectedBoard.possibilities[possibilityIndex];
    const piece = getPiece({ row: 2, column: 5, type: selectedBoard.currentPiece, orientation: Orientation.Down });
    possibility.blocks.forEach(({ row, column }) => updatedBoard[row][column] = piece.blocks[0].value);
  }

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
      <button onClick={() => setPossibilityIndex((possibilityIndex + selectedBoard!.possibilities.length - 1) % selectedBoard!.possibilities.length)}>
        {'<'}
      </button>
      <button onClick={() => setPossibilityIndex((possibilityIndex + 1) % selectedBoard!.possibilities.length)}>
        {'>'}
      </button>
      { selectedBoard && updatedBoard ? <TetrisGrid beforeGrid={selectedBoard.board} grid={updatedBoard} /> : undefined }
    </div>
  );
}

export default App;
