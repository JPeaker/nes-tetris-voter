import { BlockPlace, getPiece, Grid, Orientation, Piece, PieceList } from 'nes-tetris-representation';
import { findAllPossiblePositions } from '../server/position-finder';
import _ from 'lodash';

describe('findAllPossiblePositions', () => {
  describe('does not conflict any blocks on test grid 1', () => {
    const testGrid1: Grid = [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,2,3,0,0,0,0,0,0],
      [3,3,3,3,0,0,0,0,0,0],
      [0,0,0,3,0,0,0,0,0,0],
      [0,1,1,3,3,0,0,0,0,0],
      [0,0,2,0,0,1,0,0,0,0],
      [0,0,0,3,1,0,0,0,0,2],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,2],
      [2,2,2,0,0,0,0,0,3,2],
      [1,0,0,0,0,0,0,0,3,3],
      [0,3,3,1,0,1,0,3,3,0],
      [2,3,3,0,0,0,0,3,0,0],
      [0,2,2,0,0,0,0,0,0,3],
      [0,0,0,0,3,3,0,0,1,0],
      [2,3,1,1,0,0,0,2,2,0],
      [2,2,2,1,1,0,0,3,3,0]
    ];

    PieceList.forEach(({ value, label }) => {
      describe(label, () => {
        findAllPossiblePositions({ row: 2, column: 5, orientation: Orientation.Down, type: value }, testGrid1).forEach(possibility => {
          describe(`possibility [{${possibility.block1X},${possibility.block1Y}},{${possibility.block2X},${possibility.block2Y}},{${possibility.block3X},${possibility.block3Y}},{${possibility.block4X},${possibility.block4Y}}]`, () => {
            possibility.blocks().forEach(block => {
              it(`should have 0 in the grid for row: ${block.row}, column: ${block.column}, and be inbounds`, () => {
                expect(testGrid1[block.row][block.column]).toEqual(0);
                expect(block.row >= 0).toBe(true);
                expect(block.row < 22).toBe(true);
                expect(block.column >= 0).toBe(true);
                expect(block.column < 10).toBe(true);
              });
            });
          });
        });
      });
    })
  });

  it('finds the J spin in test grid 2', () => {
    const testGrid1: Grid = [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [1,1,1,0,0,0,0,3,0,0],
      [1,3,3,1,0,0,0,3,3,3],
      [2,3,3,1,0,0,1,3,1,3],
      [2,2,2,0,0,0,1,1,1,3],
      [3,3,3,3,0,0,3,2,1,1],
      [2,3,1,1,0,3,3,2,2,2],
      [2,2,2,1,0,3,3,3,3,3]
    ];

    const blocksToSorted = (blocks: { row: number, column: number }[]) => blocks.sort((b1, b2) => b2.row - b1.row || b2.column - b1.column);
    const positions = findAllPossiblePositions({ row: 2, column: 5, orientation: Orientation.Down, type: Piece.J }, testGrid1)
      .map(p => [
        { row: p.block1Y, column: p.block1X },
        { row: p.block2Y, column: p.block2X },
        { row: p.block3Y, column: p.block3X },
        { row: p.block4Y, column: p.block4X },
      ]);
    const sortedMapped = positions.map(blocksToSorted).map(x => x.reduce((acc, { row, column }) => acc + `[${row},${column}]`, ''));

    const expectedBlocks = getPiece({
      type: Piece.J,
      row: 18,
      column: 4,
      orientation: Orientation.Down,
    }).blocks
      .map(block => ({ row: block.row, column: block.column }))
      .sort((b1, b2) => b2.row - b1.row || b2.column - b1.column)
      .reduce((acc, { row, column }) => acc + `[${row},${column}]`, '');

    expect(sortedMapped.includes(expectedBlocks)).toBe(true);
  });
});