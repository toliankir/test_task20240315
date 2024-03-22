import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfig implements SharedBullConfigurationFactory {
  private readonly connectionUrl: URL;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'REDIS_BULL_CONNECTION_STRING',
    );
    if (!connectionString) {
      throw new Error(
        'Miscofiguration REDIS_BULL_CONNECTION_STRING must be set',
      );
    }
    this.connectionUrl = new URL(connectionString);
  }

  createSharedConfiguration():
    | BullRootModuleOptions
    | Promise<BullRootModuleOptions> {
    return {
      redis: {
        db: parseInt(this.connectionUrl.pathname.split('/')[1]),
        host: this.connectionUrl.hostname,
        port: parseInt(this.connectionUrl.port),
        password: this.connectionUrl.password,
      },
    };
  }
}
