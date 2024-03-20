import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class StartLoginFlowRequestDto {
  @ApiProperty({ example: 'test@mail.com', required: true })
  @IsEmail()
  @IsString()
  email: string;
}
