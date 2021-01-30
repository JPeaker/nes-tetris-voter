import { Grid, Piece } from 'nes-tetris-representation';
import { ObjectType, Field, ID, Int, GraphQLISODateTime } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad } from 'typeorm';
import { RelatedPossibility } from './RelatedPossibility';

@Entity({ name: 'boards' })
@ObjectType({ description: 'The Board model' })
export class Board extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: string;

    @Field(() => GraphQLISODateTime)
    @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Field(() => Int)
    @Column('int')
    currentPiece!: Piece;

    @Field(() => Int, { nullable: true })
    @Column('int', { nullable: true })
    nextPiece!: Piece | null;

    @OneToMany(() => RelatedPossibility, possibility => possibility.board, { eager: true })
    possibilities!: RelatedPossibility[];

    @Field(() => [[Int]])
    @Column({ type: 'int', array: true, nullable: false })
    board!: Grid;

    @AfterLoad()
    @Field(() =>  Int)
    votes() {
        return this.possibilities ? this.possibilities.reduce((acc, poss) => acc + poss.votes, 0) : 0;
    }
}