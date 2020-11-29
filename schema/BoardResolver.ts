import { Query, Resolver, ResolverInterface } from 'type-graphql';
import { Board } from './Board';

@Resolver(() => Board)
export class BoardResolver {
  private readonly items: Board[] = [{
    id: '1',
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
    board: [[0],[1]],
  }];

  @Query(() => [Board])
  async boards(): Promise<Board[]> {
    return this.items;
  }
};