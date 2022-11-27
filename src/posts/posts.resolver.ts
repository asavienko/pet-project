import { Body, ExecutionContext, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/gql-auth.guard';

import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Post])
  async posts(): Promise<Post[]> {
    const posts = await this.postsService.findAll();
    return posts;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Post])
  async myPosts(@Body('userId') userId: number): Promise<Post[]> {
    const posts = await this.postsService.findByUserId(userId);
    return posts;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Post)
  async publishPosts(
    @Args('post') post: string,
    // TODO Add types
    @Context() ctx: any,
  ): Promise<Post> {
    const createdPost = await this.postsService.create(post, ctx?.req?.user);
    return createdPost;
  }
}
