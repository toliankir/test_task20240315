import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class GetFileRequestDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsPositive()
  messageId: number;

  @ApiProperty({ example: 'image.jpeg' })
  @IsString()
  filename: string;
}
