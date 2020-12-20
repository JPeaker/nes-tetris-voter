import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
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
  row() { return this.possibility.row }

  @Field(() => Int)
  column() { return this.possibility.column }

  @Field(() => Int)
  orientation() { return this.possibility.orientation }

  @Field(() => Int)
  type() { return this.possibility.type }

  @ManyToOne(() => Board, board => board.possibilities)
  board!: Board;

  @ManyToOne(() => Possibility, { eager: true })
  possibility!: Possibility

  @Field(() => Int)
  @Column('int', { default: 0 })
  votes!: number;
}