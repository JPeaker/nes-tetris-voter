import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType({ description: 'Block Co-ordinate' })
export class Coordinate {
  @Field(() => Int)
  row!: number;

  @Field(() => Int)
  column!: number
}