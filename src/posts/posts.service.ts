import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/users.entity';

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

    console.log(newPost);

    const result = await this.postsRepo.save(newPost);
    return result;
  }
}
