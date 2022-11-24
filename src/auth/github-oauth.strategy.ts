import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport';

import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.env.GITHUB_CLIENT_ID,
      clientSecret: configService.env.GITHUB_CLIENT_SECRET,
      callbackURL: configService.env.SSO_CALLBACK_URL,
      scope: ['email', 'name'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id } = profile;
    console.log(profile);
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
