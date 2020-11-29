import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType({ description: 'The Board model' })
export class Board {
    @Field(() => ID)
    id!: string;

    @Field()
    createdAt!: Date;

    @Field()
    lastUpdatedAt!: Date;

    @Field(() => [[Int]])
    board!: number[][];
}