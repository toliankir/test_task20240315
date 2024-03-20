import { Injectable } from '@nestjs/common';
import { SaveMessageRequestDto } from './dto/save-message.request.dto';
import { MessageEntity } from 'src/database/entity/message.entity';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ThreadResponseDto } from './dto/thread.response.dto';
import { IdMessageDto } from './dto/id.message.dto';
import { ThreadMessageEntity } from '../../database/entity/thread-message.entity';
import { ThreadMessageResponseDto } from './dto/thread-message.response.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ThreadMessageEntity)
    private readonly messageThreeRepository: Repository<ThreadMessageEntity>,
  ) {}

  public async saveMessage(data: SaveMessageRequestDto): Promise<IdMessageDto> {
    const newMessageEntity: DeepPartial<MessageEntity> = {
      name: data.name,
      email: data.email,
      homepage: data.homepage,
      text: data.text,
      parentMessageId: data.replayToId,
    };

    const saved: MessageEntity =
      await this.messageRepository.save(newMessageEntity);

    return {
      id: saved.id,
    };
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

  public async getThreads(
    offset: number,
    limit: number,
  ): Promise<ThreadResponseDto[]> {
    const messages: MessageEntity[] = await this.messageRepository.find({
      where: {
        parentMessageId: IsNull(),
      },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
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
