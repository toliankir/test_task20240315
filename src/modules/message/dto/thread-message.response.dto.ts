import { ApiProperty } from '@nestjs/swagger';
import { ThreadMessageEntity } from '../../../database/entity/thread-message.entity';
import { ThreadResponseDto } from './thread.response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ThreadMessageResponseDto extends ThreadResponseDto {
  @ApiProperty({ example: '1' })
  @Field()
  public readonly threadId: number;

  @ApiProperty({ example: '[1, 2, 3]', isArray: true })
  @Field(() => [Number])
  public readonly path: number[];

  @ApiProperty({ example: '2', description: 'Parent message id' })
  @Field()
  public readonly parentId: number | null;

  public static fromEntity(
    entity: ThreadMessageEntity,
  ): ThreadMessageResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      homepage: entity.homepage || null,
      text: entity.text,
      parentId: entity.parentMessageId || null,
      files: [],
      threadId: entity.threadId,
      path: entity.path.split(',').map((e) => parseInt(e)) || [],
      createdAt: entity.createdAt.toString(),
    };
  }
}
