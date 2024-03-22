import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UploadResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;
}
