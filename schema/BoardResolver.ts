import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Board } from './Board';
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
  createBoard(@Arg('board', () => BoardInput) board: BoardInput): Board {
    const x = Board.create(board);
    console.log(x);
    return x;
  }
};