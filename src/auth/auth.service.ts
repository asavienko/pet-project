import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { generate } from 'generate-password';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';

import { ConfigService } from '../config/config.service';
import {
  AUTHORIZATION_HEADER,
  GITHUB_CODE_EXCHANGE_URL,
  GITHUB_RESPONSE_ERROR,
  GITHUB_RESPONSE_ERROR_DESCRIPTION,
  GITHUB_RESPONSE_ERROR_URI,
  GITHUB_USER_API,
} from '../constants';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

import { GithubResponseDto } from './dto/github-response.dto';
import { GithubUserResponseDto } from './dto/github-user-response.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { SignInInput } from './dto/sign-in-input.dto';
import { SignInResult } from './dto/sign-in-result.dto';
import { SignUpInput } from './dto/sign-up-input.dto';
import { SsoInput } from './dto/sso-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async signUp(input: SignUpInput): Promise<User> {
    const u = new User();
    Object.assign(u, input);
    u.password = AuthService.encryptPassword(u.password);
    const result = await this.usersRepo.save(u);
    return result;
  }

  private static encryptPassword(password): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  async signIn(input: SignInInput): Promise<SignInResult> {
    const user = await this.usersService.findOneByName(input.name);
    if (!user) {
      return new SignInResult();
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      return new SignInResult();
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return { ...user, token };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOneByName(payload.name);
    return user;
  }

  async exchangeGitHubCode(code: string): Promise<GithubResponseDto> {
    const params = new URLSearchParams();
    params.set('client_id', this.config.env.GITHUB_CLIENT_ID);
    params.set('client_secret', this.config.env.GITHUB_CLIENT_SECRET);
    params.set('redirect_uri', this.config.env.GITHUB_CALLBACK_URL);
    params.set('code', code);
    params.set('scope', 'user:email');

    try {
      const data = await firstValueFrom(
        this.httpService
          .post(GITHUB_CODE_EXCHANGE_URL, '', {
            params,
          })
          .pipe(map((res) => res.data)),
      );
      const urlParams = new URLSearchParams(data);
      const result = {
        access_token: '',
        scope: '',
        token_type: '',
      };
      urlParams.forEach((value, key) => {
        if (
          [
            GITHUB_RESPONSE_ERROR,
            GITHUB_RESPONSE_ERROR_DESCRIPTION,
            GITHUB_RESPONSE_ERROR_URI,
          ].includes(key)
        ) {
          throw new UnauthorizedException();
        }
        result[key] = value;
      });
      return result;
    } catch (error) {
      // TODO add sentry
      console.error(error);

      throw new Error('GitHub Auth Error');
    }
  }

  async getUserData(token: string): Promise<GithubUserResponseDto> {
    const headers = {
      [AUTHORIZATION_HEADER]: `Bearer ${token}`,
    };
    const data = await firstValueFrom(
      this.httpService
        .get(GITHUB_USER_API, { headers })
        .pipe(map((res) => res.data)),
    );

    return data;
  }

  async sso(input: SsoInput): Promise<SignInResult> {
    const githubResponseDto = await this.exchangeGitHubCode(input.code);
    const userData = await this.getUserData(githubResponseDto.access_token);

    let user = await this.usersService.findOneByEmail(userData?.email);

    if (!user) {
      user = new User();
      user.avatar = userData.avatar_url;
      user.name = userData.name;
      user.email = userData.email;

      const randomPassword = generate({
        length: 10,
        numbers: true,
      });

      user.password = AuthService.encryptPassword(randomPassword);

      await this.usersRepo.save(user);
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return { ...user, token };
  }
}
