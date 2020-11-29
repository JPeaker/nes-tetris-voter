import { Field, Int, InputType } from 'type-graphql';
import { Board } from './Board';

@InputType()
export class BoardInput implements Partial<Board> {
    @Field(() => [[Int]])
    board!: number[][];
}