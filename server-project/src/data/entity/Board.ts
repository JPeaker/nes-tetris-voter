import { Grid, Piece } from 'nes-tetris-representation';
import { ObjectType, Field, ID, Int, GraphQLISODateTime } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Possibility } from './Possibility';

@Entity({ name: 'boards' })
@ObjectType({ description: 'The Board model' })
export class Board extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => GraphQLISODateTime)
    @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Field(() => Int)
    @Column('int')
    currentPiece!: Piece;

    @Field(() => Int)
    @Column('int')
    nextPiece!: Piece;

    @Field(() => [Possibility])
    @ManyToMany(() => Possibility, { eager: true })
    @JoinTable()
    possibilities!: Possibility[];

    @Field(() => [[Int]])
    @Column({ type: 'int', array: true, nullable: false })
    board!: Grid;
}