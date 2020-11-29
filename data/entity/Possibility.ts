import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'possibilities' })
@ObjectType({ description: 'Possible placements' })
export class Possibility extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Int)
    @Column('int')
    block1X!: number;

    @Field(() => Int)
    @Column('int')
    block1Y!: number;

    @Field(() => Int)
    @Column('int')
    block2X!: number;

    @Field(() => Int)
    @Column('int')
    block2Y!: number;

    @Field(() => Int)
    @Column('int')
    block3X!: number;

    @Field(() => Int)
    @Column('int')
    block3Y!: number;

    @Field(() => Int)
    @Column('int')
    block4X!: number;

    @Field(() => Int)
    @Column('int')
    block4Y!: number;
}