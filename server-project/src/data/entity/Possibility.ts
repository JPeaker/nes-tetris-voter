import { ColumnIndex, Orientation, Piece, RowIndex } from 'nes-tetris-representation';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { Coordinate } from '../Coordinate';

@Entity({ name: 'possibilities' })
@ObjectType({ description: 'Possible placements of a piece on the board. Unrelated to any specific scenario' })
export class Possibility extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @AfterLoad()
  @Field(() => [Coordinate])
  blocks() {
    return [
      { row: this.block1Y, column: this.block1X },
      { row: this.block2Y, column: this.block2X },
      { row: this.block3Y, column: this.block3X },
      { row: this.block4Y, column: this.block4X },
    ];
  }

  @Field(() => Piece)
  @Column('int')
  piece!: Piece;

  @Field(() => Int)
  @Column('int')
  row!: RowIndex;

  @Field(() => Int)
  @Column('int')
  column!: ColumnIndex;

  @Field(() => Orientation)
  @Column('int')
  orientation!: Orientation;

  @Column('int')
  block1X!: number;

  @Column('int')
  block1Y!: number;

  @Column('int')
  block2X!: number;

  @Column('int')
  block2Y!: number;

  @Column('int')
  block3X!: number;

  @Column('int')
  block3Y!: number;

  @Column('int')
  block4X!: number;

  @Column('int')
  block4Y!: number;
}