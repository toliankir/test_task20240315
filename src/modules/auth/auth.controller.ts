import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { GetUser } from './decorator/user.decorator';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from './types/user';
import { StartLoginFlowRequestDto } from './dto/start-login.request.dto';
import { StartLoginFlowResponseDto } from './dto/start-login.response.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: StartLoginFlowResponseDto })
  @ApiBody({ type: StartLoginFlowRequestDto })
  @Post('start-login')
  async startLoginFlow(
    @Body() data: StartLoginFlowRequestDto,
  ): Promise<StartLoginFlowResponseDto> {
    await this.authService.startLoginFlow(data.email);
    return {
      success: true,
    };
  }

  @ApiResponse({ type: LoginResponseDto })
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @GetUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() data: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @ApiResponse({ type: RefreshResponseDto })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refresh(@GetUser() user: User): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(user);
  }
}
