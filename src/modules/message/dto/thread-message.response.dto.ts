import { ApiProperty } from '@nestjs/swagger';
import { ThreadMessageEntity } from '../../../database/entity/thread-message.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { MessageFileResponseDto } from './message-file.response.dto';

@ObjectType()
export class ThreadMessageResponseDto {
  @ApiProperty({ example: '1' })
  @Field()
  public readonly id: number;

  @ApiProperty({ example: 'John Doe' })
  @Field()
  public readonly name: string;

  @ApiProperty({ example: 'test@mail.com' })
  @Field()
  public readonly email: string;

  @ApiProperty({ example: 'www.site.com' })
  @Field({ nullable: true })
  public readonly homepage: string | null;

  @ApiProperty({ example: 'Some interistng text' })
  @Field()
  public readonly text: string;

  @ApiProperty()
  @Field(() => [MessageFileResponseDto])
  public readonly files: MessageFileResponseDto[];

  @ApiProperty({ example: 'Some interistng text' })
  @Field()
  public readonly createdAt: string;

  @ApiProperty({ example: '1' })
  @Field()
  public readonly threadId: number;

  @ApiProperty({ example: '[1, 2, 3]', isArray: true })
  @Field(() => [Number])
  public readonly path: number[];

  @ApiProperty({ example: '2', description: 'Parent message id' })
  @Field({ nullable: true })
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
      files: entity.files || [],
      threadId: entity.threadId,
      path: entity.path.split(',').map((e) => parseInt(e)) || [],
      createdAt: entity.createdAt.toString(),
    };
  }
}
