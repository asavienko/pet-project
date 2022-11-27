import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/gql-auth.guard';

import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query((returns) => [Post])
  async posts(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
  ): Promise<Post[]> {
    const posts = await this.postsService.findAll({ limit, offset });

    return posts;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => [Post])
  async myPosts(@Context('userId') { req }: any): Promise<Post[]> {
    const posts = await this.postsService.findByUserId(req.user.id);
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
