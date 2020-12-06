import { Orientation } from 'nes-tetris-representation';
import { Possibility } from './CommonModels';
import { ConsideredPlacement } from './Vote';

interface IdToIndexMap {
  [key: string]: number;
}

export default (
  possibility: Possibility,
  possibilities: Possibility[],
  consideredPlacement: ConsideredPlacement,
  setConsideredPlacement: (placement: ConsideredPlacement) => void,
) => {
  const possibilityMapIdToIndex = possibilities.reduce((aggMap: IdToIndexMap, poss: Possibility, index: number) => {
    aggMap[poss.id] = index;
    return aggMap;
  }, {} as IdToIndexMap);

  return (orientation: Orientation) => () => {
    if (!possibility) {
      return;
    }

    let index: number;

    // It's easy if we don't have to worry about rows and columns
    if (consideredPlacement.row === undefined && consideredPlacement.column === undefined) {
      const currentIndex = possibilityMapIdToIndex[possibility.id];
      const remainderIndex = possibilities.slice(currentIndex + 1).findIndex(p =>
        p.orientation === orientation &&
        (!consideredPlacement.row && !consideredPlacement.column || (p.row === consideredPlacement.row && p.column === consideredPlacement.column))
      );

      index = remainderIndex === -1 ? currentIndex : currentIndex + remainderIndex + 1;

      if (index === currentIndex) {
        index = possibilities.findIndex(p => p.orientation === orientation);
      }
    }
    else {
      const filteredPossibilities = possibilities.filter(p =>
        p.orientation === orientation &&
        p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));

      if (filteredPossibilities.length === 0) {
        const currentIndex = possibilityMapIdToIndex[possibility.id];
        const possibilitiesFilteredWithJustRowColumnFromCurrent = possibilities.slice(currentIndex + 1).filter(p =>
          p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));

        if (possibilitiesFilteredWithJustRowColumnFromCurrent.length > 0) {
          index = possibilityMapIdToIndex[possibilitiesFilteredWithJustRowColumnFromCurrent[0].id];
        } else {
          const possibilitiesFilteredWithJustRowColumn = possibilities.filter(p =>
            p.blocks.some(p => p.row === consideredPlacement.row && p.column === consideredPlacement.column));
          if (possibilitiesFilteredWithJustRowColumn.length > 0) {
            index = possibilityMapIdToIndex[possibilitiesFilteredWithJustRowColumn[0].id];
          } else {
            index = possibilityMapIdToIndex[possibility.id];
          }
        }
      } else {
        const adjustedPossibilityIndex = possibility ? filteredPossibilities.findIndex(p => p.id === possibility.id) : 0;
        if (adjustedPossibilityIndex === -1) {
          index = possibilityMapIdToIndex[filteredPossibilities[0].id];

          if (index === -1) {
            index = consideredPlacement.index || 0;
          }
        } else if (adjustedPossibilityIndex === filteredPossibilities.length - 1) {
          index = possibilityMapIdToIndex[filteredPossibilities[0].id];
        } else {
          index = possibilityMapIdToIndex[filteredPossibilities[adjustedPossibilityIndex + 1].id];
        }
      }
    }

    setConsideredPlacement({ ...consideredPlacement, orientation, index });
  }
}