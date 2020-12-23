import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Board } from './entity/Board';
import { BoardInput } from './BoardInput';
import { findAllPossiblePositions } from '../position-finder';
import { Orientation } from 'nes-tetris-representation';
import { RelatedPossibility } from './entity/RelatedPossibility';
import { Possibility } from './entity/Possibility';

@Resolver(() => Board)
export class BoardResolver {
  @FieldResolver(() => [RelatedPossibility])
  possibilities(@Root() board: Board) {
    return board.possibilities.sort((p1, p2) =>
      p1.column() - p2.column() ||
      p1.row() - p2.row() ||
      p1.orientation() - p2.orientation() ||
      p1.votes - p2.votes);
  }

  @Query(() => [Board])
  async boards(): Promise<Board[]> {
    return await Board.find();
  }

  @Query(() => Board)
  async board(@Arg('id', () => String, { nullable: true }) id?: string): Promise<Board | undefined> {
    let adjustedId = id;
    if (id === undefined) {
      const slimBoard = await Board.getRepository().createQueryBuilder()
      .select('boards.id')
      .from(Board, 'boards')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();

      if (!slimBoard) {
        return undefined;
      }

      adjustedId = slimBoard.id;
    }

    const found = await Board.findOne(adjustedId);

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

    const existingBoard = await Board.findOne({ where: {
      board: boardInput.board,
      currentPiece: boardInput.currentPiece,
      nextPiece: boardInput.nextPiece
    } });

    if (existingBoard) {
      throw new Error(`Board exists with id: ${existingBoard.id}`);
    }

    // Save the board
    const dbBoard = Board.create(boardInput);
    await dbBoard.save();

    // Save all the related possibilities
    const possibilities = findAllPossiblePositions({
      type: boardInput.currentPiece,
      row: 2,
      column: 5,
      orientation: Orientation.Down,
    }, boardInput.board);
    await Promise.all(possibilities.map(async possibility => {
      const foundPossibility = await Possibility.findOne({ where: possibility });

      return RelatedPossibility.create({
        board: dbBoard,
        possibility: foundPossibility!,
      }).save();
    }));

    // Get the board again so we have all the possibilities
    return (await Board.findOne(dbBoard.id))!;
  }

  @Mutation(() => Boolean)
  async deleteBoard(@Arg('id', () => Int) id: string): Promise<boolean> {
    const existingBoard = await Board.findOne({ where: { id } });

    if (!existingBoard) {
      throw new Error(`Board doesn't exist with id: ${id}`);
    }

    await existingBoard.remove();
    return true;
  }
};