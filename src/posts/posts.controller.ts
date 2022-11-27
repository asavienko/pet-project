import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('api/users')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Post[]> {
    const users = await this.postsService.findAll({});
    return users;
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':userId')
  async findOneByName(@Param('userId') userId: number): Promise<Post[]> {
    const post = await this.postsService.findByUserId(userId);
    return post;
  }
}
