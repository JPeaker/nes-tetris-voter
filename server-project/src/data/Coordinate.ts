import { ObjectType, Field, ID, Int } from 'type-graphql';
import { BaseEntity } from 'typeorm';

@ObjectType({ description: 'Block Co-ordinate' })
export class Coordinate extends BaseEntity {
  @Field(() => Int)
  row!: number;

  @Field(() => Int)
  column!: number
}