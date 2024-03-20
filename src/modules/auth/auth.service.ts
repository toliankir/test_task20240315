import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';
import { User } from './types/user';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtTtl: number;
  private readonly jwtTtlRefresh: number;
  private readonly redisCacheTtl: number;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    readonly configService: ConfigService,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET');
    if (!this.jwtSecret) {
      const errorMessage = 'JWT_SECRET must be set.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!this.jwtSecret) {
      const errorMessage = 'JWT_REFRESH_SECRET must be set.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    let jwtTtlNumber = parseInt(configService.get<string>('JWT_TTL_MINUTES'));
    if (isNaN(jwtTtlNumber)) {
      this.logger.warn(`JWT_TTL_MINUTES incorrect value. Use default value.`);
      jwtTtlNumber = 60;
    }

    let jwtTtlRefreshNumber = parseInt(
      configService.get<string>('JWT_REFRESH_TTL_MINUTES'),
    );
    if (isNaN(jwtTtlRefreshNumber)) {
      this.logger.warn(
        `JWT_REFRESH_TTL_MINUTES incorrect value. Use default value.`,
      );
      jwtTtlRefreshNumber = 43200;
    }

    let redisCacheTtlNumber = parseInt(
      configService.get<string>('REDIS_CACHE_TTL_MIN'),
    );
    if (isNaN(redisCacheTtlNumber)) {
      this.logger.warn(
        `REDIS_CACHE_TTL_MIN incorrect value. Use default value.`,
      );
      redisCacheTtlNumber = 15;
    }

    this.jwtTtl = jwtTtlNumber * 60;
    this.jwtTtlRefresh = jwtTtlRefreshNumber * 60;
    this.redisCacheTtl = redisCacheTtlNumber * 60;
  }

  public async startLoginFlow(email: string): Promise<void> {
    const code = '1234'; // Math.trunc(Math.random() * 9999);
    await this.cacheManager.set(email, code, this.redisCacheTtl);
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const code: string = await this.cacheManager.get(email);

    if (code !== password) {
      return null;
    }

    await this.cacheManager.del(email);
    return {
      email,
    };
  }

  public async login({ email }: User): Promise<LoginResponseDto> {
    const userPayload: User = {
      email,
    };
    const token = await this.jwtService.signAsync(userPayload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtTtl,
    });
    const refreshToken = await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtTtlRefresh,
      },
    );

    return {
      email,
      token,
      refreshToken,
    };
  }

  public async refreshToken(user: User): Promise<RefreshResponseDto> {
    const token = await this.jwtService.signAsync(user, {
      secret: this.jwtSecret,
      expiresIn: this.jwtTtl,
    });

    return {
      email: user.email,
      token,
    };
  }
}
