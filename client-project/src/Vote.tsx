import React, { useEffect, useState } from 'react';
import { ColumnIndex, getPiece, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import VoteButton from './VoteButton';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './vote-input-handler';

export type ConsideredPlacement = { row?: RowIndex, column?: ColumnIndex, orientation?: Orientation };

function Vote({ board }: { board: Board }) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>({});
  const [consideredPossibilityIndex, setConsideredPossibilityIndex] = useState<number>(0);
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);
  const [votedFor, setVotedFor] = useState<Possibility | null>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      Escape: () => {
        setSelectedPossibility(null);
        setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: undefined });
      },
      KeyW: () => {
        setSelectedPossibility(null);
        setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: Orientation.Up});
      },
      KeyA: () => {
        setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: Orientation.Left});
        setSelectedPossibility(null);
      },
      KeyS: () => {
        setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: Orientation.Down});
        setSelectedPossibility(null);
      },
      KeyD: () => {
        setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: Orientation.Right});
        setSelectedPossibility(null);
      },
      ArrowLeft: () => {
        if (consideredPossibilityIndex > 0) {
          setConsideredPossibilityIndex(consideredPossibilityIndex - 1);
        }
        setSelectedPossibility(null);
      },
      ArrowRight: () => {
        if (consideredPossibilityIndex > 0) {
          setConsideredPossibilityIndex(consideredPossibilityIndex + 1);
        }
        setSelectedPossibility(null);
      },
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  const consideredPossibilities = board.possibilities.filter(possibility =>
    (consideredPlacement.orientation === undefined || consideredPlacement.orientation === possibility.orientation) &&
    (
      !consideredPlacement.row && !consideredPlacement.column ||
      possibility.blocks.some(block => consideredPlacement.row === block.row && consideredPlacement.column === block.column)
    )
  );

  const consideredPossibility = consideredPossibilities && consideredPossibilities[consideredPossibilityIndex % consideredPossibilities.length];
  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center">
        <div className="col">
          <PossibilityList
            possibilities={consideredPossibilities}
            considered={consideredPossibility}
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
            possibilityToRender={selectedPossibility || consideredPossibility}
            consideredPlacement={consideredPlacement}
            setConsideredPlacement={selectedPossibility ? undefined : setConsideredPlacement}
            setSelected={selectedPossibility ? undefined : setSelectedPossibility}
          />
        </div>
      </div>
    </div>
  );
}

export default Vote;
