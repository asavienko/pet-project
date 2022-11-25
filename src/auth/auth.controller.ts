import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../users/users.entity';

import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in-input.dto';
import { SignInResult } from './dto/sign-in-result.dto';
import { SignUpInput } from './dto/sign-up-input.dto';
import { SsoInput } from './dto/sso-input.dto';
import { GithubOauthStrategy } from './github-oauth.strategy';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GithubOauthStrategy)
  @Post('sso')
  async sso(@Body() input: SsoInput): Promise<User> {
    return this.authService.sso(input);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signUp(@Body() input: SignUpInput): Promise<User> {
    const user = await this.authService.signUp(input);
    return user;
  }

  @Post('signin')
  async signIn(@Body() input: SignInInput): Promise<SignInResult> {
    const result = await this.authService.signIn(input);
    if (!result.token) {
      throw new BadRequestException();
    }
    return result;
  }
}
