import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({ example: 'test@mail.com', required: true })
  email: string;

  @ApiProperty({ description: 'Access jwt token', required: true })
  token: string;
}
