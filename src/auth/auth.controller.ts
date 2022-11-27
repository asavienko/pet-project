import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Req,
  Res,
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
import { AuthGuard } from '@nestjs/passport';
import * as passport from 'passport';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sso')
  async sso(@Body() input: SsoInput): Promise<User> {
    return this.authService.sso(input);
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubSso(
    @Req() req: any,
    @Res() res: any,
    @Next() next: any,
    @Body() body: any,
    @Param('provider') provider: GithubOauthStrategy,
  ): Promise<void> {}

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
