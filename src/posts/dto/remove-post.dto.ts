import { Field, ID, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class RemovePostInput {
  @ApiProperty()
  @Field((type) => ID)
  readonly id: number;
}
