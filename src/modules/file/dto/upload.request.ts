import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UploadRequestDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  @IsPositive()
  messageId: number;
}
