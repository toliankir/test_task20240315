import { ObjectType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@ObjectType()
export class IdMessageDto {
  @ApiProperty({ example: '1', description: 'Uniqe message id' })
  @IsNumber()
  @Field()
  public readonly id: number;
}
