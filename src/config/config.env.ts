import { IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';

type NODE_ENV = 'development' | 'production' | 'test';
type TYPEORM_TYPE = 'auto' | 'sqlite' | 'postgres';

export class EnvConfig {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: NODE_ENV;

  @IsNumber()
  PORT: number;

  @IsIn(['auto', 'sqlite', 'postgres'])
  TYPEORM_TYPE: TYPEORM_TYPE;

  @IsString()
  TYPEORM_HOST: string;

  @IsString()
  TYPEORM_USERNAME: string;

  @IsString()
  TYPEORM_PASSWORD: string;

  @IsString()
  TYPEORM_DATABASE: string;

  @IsNumber()
  TYPEORM_PORT: number;

  @IsBoolean()
  TYPEORM_LOGGING: boolean;

  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  HEALTH_CHECK_DATABASE_TIMEOUT_MS: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRES_IN: number;

  @IsBoolean()
  SKIP_AUTH: boolean;

  @IsBoolean()
  SWAGGER_UI: boolean;

  @IsBoolean()
  GQL_PLAYGROUND: boolean;

  @IsString()
  GQL_SCHEMA_FILE: string;

  @IsString()
  GITHUB_CLIENT_ID: string;

  @IsString()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  GITHUB_CALLBACK_URL: string;

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();
    obj.NODE_ENV = 'development';
    obj.PORT = 3001;
    obj.TYPEORM_TYPE = 'auto';
    obj.TYPEORM_HOST = 'localhost';
    obj.TYPEORM_USERNAME = 'postgres';
    obj.TYPEORM_PASSWORD = 'postgres';
    obj.TYPEORM_DATABASE = 'postgres';
    obj.TYPEORM_PORT = 5432;
    obj.TYPEORM_LOGGING = false;
    obj.DATABASE_URL = '';
    obj.HEALTH_CHECK_DATABASE_TIMEOUT_MS = 3000;
    obj.JWT_SECRET = 'super_secret_string';
    obj.JWT_EXPIRES_IN = 86_400;
    obj.SKIP_AUTH = false;
    obj.SWAGGER_UI = false;
    obj.GQL_PLAYGROUND = false;
    obj.GQL_SCHEMA_FILE = 'schema.graphql';
    // TODO : FOR DEMO ONLY REMOVE AFTER THAT
    obj.GITHUB_CLIENT_ID = '774bd10fa2531d25569c';
    // TODO : FOR DEMO ONLY REMOVE AFTER THAT
    obj.GITHUB_CLIENT_SECRET = '991fa641855868644d8fcbb0fd1259261064e888';
    obj.GITHUB_CALLBACK_URL = 'http://127.0.0.1:5173/v1/oauth/redirect';
    return obj;
  }
}
