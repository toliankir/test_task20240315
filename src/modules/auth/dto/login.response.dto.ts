import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'test@mail.com', required: true })
  email: string;

  @ApiProperty({ description: 'Access jwt token', required: true })
  token: string;

  @ApiProperty({ description: 'Refresh jwt token', required: true })
  refreshToken: string;
}
