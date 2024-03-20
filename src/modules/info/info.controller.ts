import { Controller, Get } from '@nestjs/common';
import { InfoService } from './info.service';
import { TimeResponseDto } from './dto/time.response';
import { ApiResponse } from '@nestjs/swagger';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @ApiResponse({ type: TimeResponseDto })
  @Get()
  public getTime(): TimeResponseDto {
    return this.infoService.getTime();
  }
}
