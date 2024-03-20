import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Injectable()
export class RedisDatabaseConfig implements CacheOptionsFactory {
  private readonly connectionUrl: URL;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'REDIS_CONNECTION_STRING',
    );
    if (!connectionString) {
      throw new Error('Miscofiguration REDIS_CONNECTION_STRING must be set');
    }
    this.connectionUrl = new URL(connectionString);
  }

  public createCacheOptions():
    | CacheModuleOptions<Record<string, any>>
    | Promise<CacheModuleOptions<Record<string, any>>> {
    return {
      store: redisStore,
      db: parseInt(this.connectionUrl.pathname.split('/')[1]),
      host: this.connectionUrl.hostname,
      port: parseInt(this.connectionUrl.port),
      password: this.connectionUrl.password,
    };
  }
}
