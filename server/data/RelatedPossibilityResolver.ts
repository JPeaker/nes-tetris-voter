import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { RelatedPossibility } from './entity/RelatedPossibility';
import { User } from './entity/User';

@Resolver(() => RelatedPossibility)
export class RelatedPossibilityResolver {
  @Query(() => RelatedPossibility)
  async possibility(@Arg('id', () => String) id: string): Promise<RelatedPossibility | undefined> {
    return await RelatedPossibility.findOne(id);
  }

  @Mutation(() => RelatedPossibility)
  async addVote(@Arg('id', () => String) id: string, @Ctx() { user }: { user: User | null }): Promise<RelatedPossibility> {
    const possibility = await RelatedPossibility.findOne(id, { relations: ['board'] });

    if (!possibility) {
      throw new Error(`Unknown possibility id: ${id}`);
    }

    possibility.votes += 1;
    if (user) {
      const { board } = possibility;
      if (user.voted.includes(board.id)) {
        throw new Error(`Already voted for scenario ${board.id} with user ID ${user.id}`);
      }

      user.voted.push(board.id);
      await user.save();
    }

    return await possibility.save();
  }

  @Mutation(() => RelatedPossibility)
  async removeVote(@Arg('id', () => String) id: string, @Ctx() { user }: { user: User | null }): Promise<RelatedPossibility> {
    const possibility = await RelatedPossibility.findOne(id, { relations: ['board'] });

    if (!possibility) {
      throw new Error(`Unknown possibility id: ${id}`);
    }

    if (possibility.votes <= 0) {
      throw new Error(`Cannot put vote count below 0, currently: ${possibility.votes}`);
    }

    if (user) {
      const { board } = possibility;
      if (!user.voted.includes(board.id)) {
        throw new Error(`User has not voted for scenario ${board.id} with user ID ${user.id}`);
      }

      user.voted = user.voted.filter(i => i !== board.id);
      await user.save();
    }

    possibility.votes += 1;
    possibility.votes -= 1;

    return await possibility.save();
  }
};