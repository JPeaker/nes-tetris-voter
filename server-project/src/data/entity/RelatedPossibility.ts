import { Piece } from 'nes-tetris-representation';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinTable } from 'typeorm';
import { Coordinate } from '../Coordinate';
import { Board } from './Board';
import { Possibility } from './Possibility';

@Entity({ name: 'related_possibility' })
@ObjectType({ description: 'A possible placement of a piece in a specific scenario' })
export class RelatedPossibility extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => [Coordinate])
  blocks() { return this.possibility.blocks() }

  @Field(() => Int)
  distance() {
    const xDiff = Math.abs(this.possibility.column - 5);
    const yDiff = Math.abs(this.possibility.row - 2);
    const orientationDiff = this.possibility.orientation as number;

    return xDiff + yDiff + orientationDiff;
  }

  @ManyToOne(() => Board, board => board.possibilities)
  board!: Board;

  @ManyToOne(() => Possibility, { eager: true })
  possibility!: Possibility
}