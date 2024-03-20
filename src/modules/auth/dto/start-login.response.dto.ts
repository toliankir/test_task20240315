import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class StartLoginFlowResponseDto {
  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  success: boolean;
}
