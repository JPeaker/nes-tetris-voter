import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { RelatedPossibility } from './entity/RelatedPossibility';

@Resolver(() => RelatedPossibility)
export class RelatedPossibilityResolver {
  @Query(() => RelatedPossibility)
  async possibility(@Arg('id', () => String) id: string): Promise<RelatedPossibility | undefined> {
    return await RelatedPossibility.findOne(id);
  }

  @Mutation(() => RelatedPossibility)
  async addVote(@Arg('id', () => String) id: string): Promise<RelatedPossibility> {
    const possibility = await RelatedPossibility.findOne(id);

    if (!possibility) {
      throw new Error(`Unknown possibility id: ${id}`);
    }

    possibility.votes += 1;

    return await possibility.save();
  }

  @Mutation(() => RelatedPossibility)
  async removeVote(@Arg('id', () => String) id: string): Promise<RelatedPossibility> {
    const possibility = await RelatedPossibility.findOne(id);

    if (!possibility) {
      throw new Error(`Unknown possibility id: ${id}`);
    }

    if (possibility.votes <= 0) {
      throw new Error(`Cannot put vote count below 0, currently: ${possibility.votes}`);
    }

    possibility.votes -= 1;

    return await possibility.save();
  }
};