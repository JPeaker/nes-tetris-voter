import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Board } from './entity/Board';
import { BoardInput } from './BoardInput';

@Resolver(() => Board)
export class BoardResolver {
  @Query(() => [Board])
  async boards(): Promise<Board[]> {
    return await Board.find();
  }

  @Query(() => Board)
  async board(@Arg('id', () => Int) id: number): Promise<Board | undefined> {
    return await Board.findOne(id);
  }

  @Mutation(() => Board)
  async createBoard(@Arg('board', () => BoardInput) boardInput: BoardInput): Promise<Board> {
    const existingBoard = await Board.findOne({ where: {
      board: boardInput.board,
    } });

    if (existingBoard) {
      throw new Error(`Board exists with id: ${existingBoard.id}`);
    }

    const dbBoard = Board.create(boardInput);
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