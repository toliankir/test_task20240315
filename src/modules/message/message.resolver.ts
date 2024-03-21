import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { ThreadResponseDto } from './dto/thread.response.dto';
import { ThreadMessageResponseDto } from './dto/thread-message.response.dto';
import { SaveMessageRequestDto } from './dto/save-message.request.dto';
import { PaginationRequestDto } from './dto/pagination.request';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/gurad/jwt-auth.guard';
import { SortRequestDto } from './dto/sort.request';
import { SaveMessageResponseDto } from './dto/save-message.response.dto';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [ThreadResponseDto], { name: 'threads' })
  public getThreads(
    @Args('pagination', { nullable: true }) pagination?: PaginationRequestDto,
    @Args('sort', { nullable: true }) sort?: SortRequestDto,
  ): Promise<ThreadResponseDto[]> {
    return this.messageService.getThreads(pagination, sort);
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

  @Mutation(() => SaveMessageResponseDto, { name: 'saveMessage' })
  @UseGuards(JwtAuthGuard)
  public async saveMessage(
    @Args('message') data?: SaveMessageRequestDto,
  ): Promise<SaveMessageResponseDto> {
    const message = await this.messageService.saveMessage(data);
    return message;
  }

  @Subscription(() => SaveMessageResponseDto, {
    name: 'messageAdd',
    resolve: (v) => v,
  })
  public messageAdded() {
    return this.messageService.pubSub.asyncIterator(
      MessageService.MESSAGE_ADDED,
    );
  }
}
