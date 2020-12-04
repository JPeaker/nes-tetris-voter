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

  const modifiedSetSelected = (possibility: Possibility | null) => {
    setSelectedPossibility(possibility);
    setConsideredPossibilityIndex(0);
  }

  const consideredPossibilities = board.possibilities.filter(possibility =>
    !consideredPlacement.row && !consideredPlacement.column ||
    possibility.blocks.some(block => consideredPlacement.row === block.row && consideredPlacement.column === block.column)
  );

  const orientedPossibilities = !!consideredPossibilities &&
    consideredPossibilities.filter(possibility => possibility.orientation === consideredPlacement.orientation);

    const removeConsiderations = () => {
      modifiedSetSelected(null);
      setConsideredPlacement({ row: consideredPlacement.row, column: consideredPlacement.column, orientation: undefined });
    };

    const prefer = (orientation: Orientation) => () => {
      if (consideredPlacement.orientation === orientation && orientedPossibilities.length > 0) {
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
    useEffect(() => {
      const handler = (event: KeyboardEvent) => inputHandler({
        Escape: removeConsiderations,
        KeyW: prefer(Orientation.Up),
        KeyA: prefer(Orientation.Left),
        KeyS: prefer(Orientation.Down),
        KeyD: prefer(Orientation.Right),
        ArrowLeft: scrollDownConsiderations,
        ArrowUp: scrollDownConsiderations,
        ArrowRight: scrollUpConsiderations,
        ArrowDown: scrollUpConsiderations,
      }, event);

      document.addEventListener('keydown', handler);

      return () => {
        document.removeEventListener('keydown', handler);
      }
    });

  const consideredPossibility = orientedPossibilities[consideredPossibilityIndex % orientedPossibilities.length] ||
    consideredPossibilities[consideredPossibilityIndex % consideredPossibilities.length];

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
          <VoteButton selected={selectedPossibility} voted={votedFor} onVoted={setVotedFor} />
          <button disabled={selectedPossibility === null} onClick={() => modifiedSetSelected(null)}>Clear Choice</button>
        </div>
        <div className="col">
          <ChoiceGrid
            grid={board.board}
            possibilities={board.possibilities}
            possibilityToRender={selectedPossibility || consideredPossibility}
            consideredPlacement={consideredPlacement}
            setConsideredPlacement={selectedPossibility ? undefined : setConsideredPlacement}
            setSelected={selectedPossibility ? undefined : modifiedSetSelected}
          />
        </div>
      </div>
    </div>
  );
}

export default Vote;
