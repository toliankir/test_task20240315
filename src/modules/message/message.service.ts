import { Injectable } from '@nestjs/common';
import { SaveMessageRequestDto } from './dto/save-message.request.dto';
import { MessageEntity } from 'src/database/entity/message.entity';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadResponseDto } from './dto/thread.response.dto';
import { ThreadMessageEntity } from '../../database/entity/thread-message.entity';
import { ThreadMessageResponseDto } from './dto/thread-message.response.dto';
import { PaginationRequestDto } from './dto/pagination.request';
import { SortRequestDto } from './dto/sort.request';
import { SaveMessageResponseDto } from './dto/save-message.response.dto';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class MessageService {
  public static MESSAGE_ADDED = 'MESSAGE_ADDED';
  public readonly pubSub: PubSub;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ThreadMessageEntity)
    private readonly messageThreeRepository: Repository<ThreadMessageEntity>,
  ) {
    this.pubSub = new PubSub();
  }

  public async saveMessage(
    data: SaveMessageRequestDto,
  ): Promise<SaveMessageResponseDto> {
    const newMessageEntity: DeepPartial<MessageEntity> = {
      name: data.name,
      email: data.email,
      homepage: data.homepage,
      text: data.text,
      parentMessageId: data.replayToId,
    };

    const saved: MessageEntity =
      await this.messageRepository.save(newMessageEntity);

    const threadMessage = await this.getThreadMessage(saved.id);
    const result: SaveMessageResponseDto = {
      id: saved.id,
      path: threadMessage.path,
    };
    console.log(result);

    this.pubSub.publish(MessageService.MESSAGE_ADDED, result);
    return result;
  }

  public async getThreadMessages(
    threadId: number,
    offset: number,
    limit: number,
  ): Promise<ThreadMessageResponseDto[]> {
    const messages: ThreadMessageEntity[] =
      await this.messageThreeRepository.find({
        where: {
          threadId,
        },
        take: limit,
        skip: offset,
      });

    return messages.map((e) => ThreadMessageResponseDto.fromEntity(e));
  }

  public async getThreadMessage(
    messageId: number,
  ): Promise<ThreadMessageResponseDto> {
    const message: ThreadMessageEntity =
      await this.messageThreeRepository.findOneOrFail({
        where: {
          id: messageId,
        },
      });

    return ThreadMessageResponseDto.fromEntity(message);
  }

  public async getThreads(
    pagination?: PaginationRequestDto,
    sort?: SortRequestDto,
  ): Promise<ThreadResponseDto[]> {
    const messages: MessageEntity[] = await this.messageRepository.find({
      where: {
        parentMessageId: IsNull(),
      },
      take: pagination?.limit || 25,
      skip: pagination?.offset || 0,
      order: { [sort?.column || 'createdAt']: sort?.order || 'desc' },
    });

    return messages.map((e) => ThreadResponseDto.fromEntity(e));
  }

  public async getMessage(messageId: number): Promise<ThreadResponseDto> {
    const message: MessageEntity = await this.messageRepository.findOneOrFail({
      where: {
        id: messageId,
        parentMessageId: IsNull(),
      },
    });

    return ThreadResponseDto.fromEntity(message);
  }
}
