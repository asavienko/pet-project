import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MinLength } from 'class-validator';

import { User } from '../../users/users.entity';

@InputType()
export class SsoInput implements Partial<User> {
  @ApiProperty()
  @Field()
  @IsAlphanumeric()
  @MinLength(1)
  readonly oauthId: string;
}
