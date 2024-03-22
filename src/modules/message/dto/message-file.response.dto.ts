import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageFileResponseDto {
  @ApiProperty({ example: '1.jpg' })
  @Field()
  public readonly filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @Field()
  public readonly mime: string;
}
