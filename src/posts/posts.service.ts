import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/users.entity';

import { RemovePostResponse } from './dto/remove-post-response.dto';
import { RemovePostInput } from './dto/remove-post.dto';
import { Post } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
  ) {}

  /* TODO Move to constants */
  async findAll({
    limit = 10,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  }): Promise<Post[]> {
    const posts = await this.postsRepo.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });
    return posts;
  }

  async findOneById(id: string | number): Promise<Post> {
    const posts = await this.postsRepo.findOne(id);
    return posts;
  }

  async findByUserId(userId: number): Promise<Post[]> {
    const posts = await this.postsRepo.find({ user: { id: userId } });
    return posts;
  }

  async create(post: string, user: User) {
    const newPost = new Post();
    newPost.post = post;
    newPost.user = user;

    const result = await this.postsRepo.save(newPost);
    return result;
  }

  async remove(
    input: RemovePostInput,
    user: User,
  ): Promise<RemovePostResponse> {
    const post = await this.postsRepo.findOne(input.id, {
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (!user.id || post.user.id !== user.id) {
      throw new UnauthorizedException();
    }
    const data = await this.postsRepo.remove(post);

    console.log(data);

    return { successful: !data.id };
  }
}
