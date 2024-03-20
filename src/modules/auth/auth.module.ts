import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisDatabaseConfig } from 'src/database/redis-database.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({ useClass: JwtConfig }),
    CacheModule.registerAsync({ useClass: RedisDatabaseConfig }),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
