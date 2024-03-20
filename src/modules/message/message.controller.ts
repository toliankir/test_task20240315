import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SaveMessageRequestDto } from './dto/save-message.request.dto';
import { ThreadResponseDto } from './dto/thread.response.dto';
import { PaginationRequestDto } from './dto/pagination.request';
import { IdMessageDto } from './dto/id.message.dto';
import { ThreadMessageResponseDto } from './dto/thread-message.response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiResponse({ type: ThreadResponseDto, isArray: true })
  @Get('thread')
  public getThreads(
    @Query() filter: PaginationRequestDto,
  ): Promise<ThreadResponseDto[]> {
    return this.messageService.getThreads(
      filter.offset || 0,
      filter.limit || 10,
    );
  }

  @ApiResponse({ type: ThreadMessageResponseDto, isArray: true })
  @Get('thread/:id/message')
  public getMessages(
    @Param() params: IdMessageDto,
    @Query() filter: PaginationRequestDto,
  ): Promise<ThreadMessageResponseDto[]> {
    return this.messageService.getThreadMessages(
      params.id,
      filter.offset || 0,
      filter.limit || 10,
    );
  }

  @ApiResponse({ type: ThreadMessageResponseDto })
  @Get(':id')
  public getMessage(@Param() params: IdMessageDto): Promise<ThreadResponseDto> {
    return this.messageService.getMessage(params.id);
  }

  @ApiResponse({ type: IdMessageDto })
  @UseGuards(git )
  @Post()
  public saveMessage(
    @Body() data: SaveMessageRequestDto,
  ): Promise<IdMessageDto> {
    return this.messageService.saveMessage(data);
  }
}
