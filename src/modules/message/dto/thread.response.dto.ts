import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from 'src/database/entity/message.entity';
import { ThreadMessageEntity } from 'src/database/entity/thread-message.entity';
import { MessageFileResponseDto } from './message-file.response.dto';

@ObjectType()
export class ThreadResponseDto {
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

  public static fromEntity(entity: MessageEntity): ThreadResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      homepage: entity.homepage || null,
      text: entity.text,
      files: entity.files.map(({ filename, mime }) => ({
        filename,
        mime,
      })),
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
