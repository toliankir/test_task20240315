import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { ThreadResponseDto } from './dto/thread.response.dto';
import { ThreadMessageResponseDto } from './dto/thread-message.response.dto';
import { SaveMessageRequestDto } from './dto/save-message.request.dto';
import { IdMessageDto } from './dto/id.message.dto';
import { PaginationRequestDto } from './dto/pagination.request';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/gurad/jwt-auth.guard';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [ThreadResponseDto], { name: 'threads' })
  public getThreads(
    @Args('pagination', { nullable: true }) pagination?: PaginationRequestDto,
  ): Promise<ThreadResponseDto[]> {
    return this.messageService.getThreads(
      pagination?.offset || 0,
      pagination?.limit || 25,
    );
  }

  @Query(() => ThreadResponseDto, { name: 'thread' })
  public getThread(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<ThreadResponseDto> {
    return this.messageService.getMessage(id);
  }

  @Query(() => [ThreadMessageResponseDto], { name: 'threadMessages' })
  public getThreadMessages(
    @Args('id') id: number,
    @Args('pagination', { nullable: true }) pagination?: PaginationRequestDto,
  ): Promise<ThreadMessageResponseDto[]> {
    return this.messageService.getThreadMessages(
      id,
      pagination?.offset || 0,
      pagination?.limit || 25,
    );
  }

  @Mutation(() => IdMessageDto, { name: 'saveMessage' })
  @UseGuards(JwtAuthGuard)
  public saveMessage(
    @Args('message') data?: SaveMessageRequestDto,
  ): Promise<IdMessageDto> {
    return this.messageService.saveMessage(data);
  }
}
