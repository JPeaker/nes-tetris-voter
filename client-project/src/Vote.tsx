import React, { useState } from 'react';
import { ColumnIndex, getPiece, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import VoteButton from './VoteButton';
import ChoiceGrid from './ChoiceGrid';

export type ConsideredPlacement = null | { row: RowIndex, column: ColumnIndex, orienation?: Orientation };

function VotePage({ board }: { board: Board }) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>(null);
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);
  const [votedFor, setVotedFor] = useState<Possibility | null>(null);

  const updatedBoard = _.cloneDeep(board.board);

  if (selectedPossibility) {
    const piece = getPiece({ row: 2, column: 5, type: board.currentPiece, orientation: Orientation.Down });
    selectedPossibility.blocks.forEach(({ row, column }) => updatedBoard[row][column] = piece.blocks[0].value);
  }

  const consideredPossibilities = board.possibilities.filter(possibility =>
    !consideredPlacement ||
    (!consideredPlacement.orienation || consideredPlacement.orienation === possibility.orientation) &&
    possibility.blocks.some(block => consideredPlacement.row === block.row && consideredPlacement.column === block.column)
  );

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center">
        <div className="col">
          <PossibilityList
            possibilities={consideredPossibilities}
            selected={selectedPossibility}
            votedFor={votedFor}
            setSelected={setSelectedPossibility}
          />
        </div>
        <div className="col">
          <VoteButton selected={selectedPossibility} voted={votedFor} onVoted={setVotedFor} />
          <button disabled={selectedPossibility === null} onClick={() => setSelectedPossibility(null)}>Clear Choice</button>
        </div>
        <div className="col">
          <ChoiceGrid
            grid={board.board}
            possibilities={board.possibilities}
            possibilityToRender={selectedPossibility || consideredPossibilities && consideredPossibilities[0]}
            setConsideredPlacement={selectedPossibility ? undefined : setConsideredPlacement}
            setSelected={selectedPossibility ? undefined : setSelectedPossibility}
          />
        </div>
      </div>
    </div>
  );
}

export default VotePage;
