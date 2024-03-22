import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class FileUploadedResponseDto {
  @ApiProperty({ example: '1' })
  @Field()
  public readonly messageId: number;

  @ApiProperty({ example: '1.jpg' })
  @Field()
  public readonly filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @Field()
  public readonly mime: string;
}
