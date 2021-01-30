import { ObjectType, Field, ID } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType({ description: 'Discord users' })
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field(() => String)
    @Column({ type: 'varchar', nullable: false })
    accessToken!: string;

    @Field(() => [String])
    @Column({ type: 'int', array: true, default: '{}' })
    voted!: string[];
}