import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super(
      {
        clientID: config.env.GITHUB_CLIENT_ID,
        clientSecret: config.env.GITHUB_CLIENT_SECRET,
        callbackURL: config.env.GITHUB_CALLBACK_URL,
        scope: ['email', 'name'],
      },
      async (accessToken: string, _refreshToken: string, profile: Profile) => {
        const { id } = profile;
        const user = await this.usersService.findOneById(id);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      },
    );
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id } = profile;
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async verify(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id } = profile;
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  public handleRequest<U extends User>(err: Error, user: U, info?: string): U {
    if (err !== undefined) {
      throw err;
    }

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
