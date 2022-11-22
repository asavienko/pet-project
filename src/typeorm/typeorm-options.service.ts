import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';

// eslint-disable-next-line import/namespace
import * as postgres from './ormconfig.postgres';

// import * as sqlite from './ormconfig.sqlite';
// import sqlite = require('../config/ormconfig.sqlite');
// import postgres = require('../config/ormconfig.postgres');

@Injectable()
export class TypeOrmOptionsService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    Logger.debug('Init', this.constructor.name);

    if (this.config.env.TYPEORM_TYPE !== 'auto') {
      const ormOptions = {
        postgres,
      };
      return ormOptions[this.config.env.TYPEORM_TYPE];
    }

    if (
      !['development', 'test', 'production'].includes(this.config.env.NODE_ENV)
    ) {
      throw new Error(`Unknown NODE_ENV: ${this.config.env.NODE_ENV}`);
    }

    return postgres;
  }
}
