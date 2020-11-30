import { Piece } from 'nes-tetris-representation';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { Coordinate } from '../Coordinate';

@Entity({ name: 'possibilities' })
@ObjectType({ description: 'Possible placements' })
export class Possibility extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @AfterLoad()
  @Field(() => [Coordinate])
  blocks() {
    return [
      { row: this.block1X, column: this.block1Y },
      { row: this.block2X, column: this.block2Y },
      { row: this.block3X, column: this.block3Y },
      { row: this.block4X, column: this.block4Y },
    ];
  }

  @Column('int')
  piece!: Piece;

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