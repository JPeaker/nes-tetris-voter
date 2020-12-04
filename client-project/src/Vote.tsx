import React, { useEffect, useState } from 'react';
import { ColumnIndex, Orientation, RowIndex } from 'nes-tetris-representation';
import _ from 'lodash';
import { Board, Possibility } from './CommonModels';
import PossibilityList from './PossibilityList';
import ConfirmVote from './ConfirmVote';
import ChoiceGrid from './ChoiceGrid';
import inputHandler from './vote-input-handler';
import describer from './possibility-describer';

export type ConsideredPlacement = { row?: RowIndex, column?: ColumnIndex, orientation?: Orientation };

function Vote({ board, voteFor, votedFor }: { board: Board, voteFor: (possibility: Possibility | null) => void, votedFor: Possibility | null }) {
  const [consideredPlacement, setConsideredPlacement] = useState<ConsideredPlacement>({});
  const [consideredPossibilityIndex, setConsideredPossibilityIndex] = useState<number>(0);
  const [selectedPossibility, setSelectedPossibility] = useState<Possibility | null>(null);

  const modifiedSetSelected = (possibility: Possibility | null) => {
    setSelectedPossibility(possibility);
    setConsideredPossibilityIndex(0);
  }

  const consideredPossibilities = board.possibilities.filter(possibility =>
    !consideredPlacement.row && !consideredPlacement.column ||
    (
      (consideredPlacement.orientation === undefined || consideredPlacement.orientation === possibility.orientation) &&
      possibility.blocks.some(block => consideredPlacement.row === block.row && consideredPlacement.column === block.column)
    )
  );

  const removeConsiderations = () => {
    modifiedSetSelected(null);
    setConsideredPlacement({ row: undefined, column: undefined, orientation: undefined });
  };

  const prefer = (orientation: Orientation) => () => {
    if (consideredPlacement.orientation === orientation && consideredPossibilities.length > 0) {
      setConsideredPossibilityIndex(consideredPossibilityIndex + 1);
    } else {
      setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation });
      setSelectedPossibility(null);
    }
  };

  const scrollDownConsiderations = () => {
    if (consideredPossibilityIndex > 0) {
      setConsideredPossibilityIndex(consideredPossibilityIndex - 1);
    }
    setSelectedPossibility(null);
  };
  const scrollUpConsiderations = () => {
    setConsideredPossibilityIndex(consideredPossibilityIndex + 1);
    setSelectedPossibility(null);
  };

  const vote = (possibility: Possibility | null) => {
    voteFor(possibility);
    setSelectedPossibility(null);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => inputHandler({
      Escape: removeConsiderations,
      KeyW: prefer(Orientation.Up),
      KeyA: prefer(Orientation.Left),
      KeyS: prefer(Orientation.Down),
      KeyD: prefer(Orientation.Right),
      ArrowUp: scrollDownConsiderations,
      ArrowDown: scrollUpConsiderations,
      Enter: () => selectedPossibility ? vote(selectedPossibility) : undefined,
    }, event);

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    }
  });

  const consideredPossibility = consideredPossibilities[consideredPossibilityIndex % consideredPossibilities.length];

  return (
    <div className="container-fluid">
      <div className="row align-items-center justify-content-center">
        <div className="col">
          <PossibilityList
            possibilities={consideredPossibilities}
            considered={consideredPossibility}
            selected={selectedPossibility}
            votedFor={votedFor}
            setSelected={modifiedSetSelected}
          />
        </div>
        <div className="col">
          <button disabled={selectedPossibility === null} onClick={() => modifiedSetSelected(null)}>Clear Choice</button>
        </div>
        <div className="col">
          <ChoiceGrid
            grid={board.board}
            possibilities={board.possibilities}
            possibilityToRender={votedFor || selectedPossibility || consideredPossibility}
            consideredPlacement={consideredPlacement}
            setConsideredPlacement={selectedPossibility ? undefined : setConsideredPlacement}
            setSelected={selectedPossibility ? undefined : modifiedSetSelected}
          />
        </div>
      </div>
      <ConfirmVote
        description={selectedPossibility ? describer(selectedPossibility) : undefined}
        show={selectedPossibility !== null}
        vote={() => vote(selectedPossibility)}
        cancel={removeConsiderations}
      />
    </div>
  );
}

export default Vote;
