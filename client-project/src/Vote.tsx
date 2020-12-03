import React, { useState } from 'react';
import { getPiece, Orientation } from 'nes-tetris-representation';
import { TetrisGrid } from 'nes-tetris-components';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';

function VotePage({ board }: { board: Board }) {
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility>(board.possibilities[0]);

  const updatedBoard = _.cloneDeep(board.board);

  const possibility = selectedPossibility || board.possibilities[0];
  const piece = getPiece({ row: 2, column: 5, type: board.currentPiece, orientation: Orientation.Down });
  possibility.blocks.forEach(({ row, column }) => updatedBoard[row][column] = piece.blocks[0].value);

  return (
    <div className="App">
      <PossibilityList
        possibilities={board.possibilities}
        selected={selectedPossibility}
        setSelected={setSelectedPossibility}
      />
      <TetrisGrid beforeGrid={board.board} grid={updatedBoard} />
    </div>
  );
}

export default VotePage;
