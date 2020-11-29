import { Field, Int, InputType } from 'type-graphql';
import { Board } from './entity/Board';

@InputType()
export class BoardInput implements Partial<Board> {
    @Field(() => [[Int]])
    board!: number[][];
}