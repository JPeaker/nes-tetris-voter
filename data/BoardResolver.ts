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
  async createBoard(@Arg('board', () => BoardInput) board: BoardInput): Promise<Board> {
    const dbBoard = Board.create(board);
    await Board.save([dbBoard]);

    return dbBoard;
  }
};