import { Grid, Piece } from 'nes-tetris-representation';
import { Field, Int, InputType } from 'type-graphql';
import { Board } from './entity/Board';

@InputType()
export class BoardInput implements Partial<Board> {
    @Field(() => [[Int]])
    board!: Grid;

    @Field(() => Int)
    currentPiece!: Piece;

    @Field(() => Int)
    nextPiece!: Piece;
}