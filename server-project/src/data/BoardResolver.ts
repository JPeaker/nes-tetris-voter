import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Board } from './entity/Board';
import { BoardInput } from './BoardInput';
import { findAllPossiblePositions } from '../position-finder';
import { Orientation } from 'nes-tetris-representation';
import { Possibility } from './entity/Possibility';

@Resolver(() => Board)
export class BoardResolver {
  @Query(() => [Board])
  async boards(): Promise<Board[]> {
    return await Board.find();
  }

  @Query(() => Board)
  async board(@Arg('id', () => Int) id: number): Promise<Board | undefined> {
    const found = await Board.findOne(id);

    if (!found) {
      return found;
    }

    return found;
  }

  @Mutation(() => Board)
  async createBoard(@Arg('board', () => BoardInput) boardInput: BoardInput): Promise<Board> {
    if (boardInput.board.length !== 22 || boardInput.board.some(row => row.length !== 10)) {
      throw new Error(`Invalid board format ${JSON.stringify(boardInput.board)}`);
    }

    const existingBoard = await Board.findOne({ where: { board: boardInput.board } });

    if (existingBoard) {
      throw new Error(`Board exists with id: ${existingBoard.id}`);
    }

    const possibilities = findAllPossiblePositions({
      type: boardInput.currentPiece,
      row: 2,
      column: 5,
      orientation: Orientation.Down,
    }, boardInput.board);

    const dbBoard = Board.create(boardInput);
    dbBoard.possibilities = (await Promise.all(
      possibilities.map(async possibility => await Possibility.findOne({ where: possibility }))
    )).filter(possibility => !!possibility) as Possibility[];
    await dbBoard.save();

    return dbBoard;
  }

  @Mutation(() => Boolean)
  async deleteBoard(@Arg('id', () => Int) id: number): Promise<boolean> {
    const existingBoard = await Board.findOne({ where: { id } });

    if (!existingBoard) {
      throw new Error(`Board doesn't exist with id: ${id}`);
    }

    await existingBoard.remove();
    return true;
  }
};