import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({ nullable: true })
  oauthId: string;

  @Field()
  @Column({ nullable: true })
  name: string;

  @Field()
  @Index()
  @Column({ nullable: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Field()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @Field((type) => Int)
  @VersionColumn()
  readonly version: number;
}
