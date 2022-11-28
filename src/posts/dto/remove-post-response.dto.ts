import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemovePostResponse {
  @Field()
  successful: boolean;
}
