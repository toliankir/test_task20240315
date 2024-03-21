import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@ObjectType()
export class SaveMessageResponseDto {
  @ApiProperty({ example: '1', description: 'Uniqe message id' })
  @IsNumber()
  @Field()
  public readonly id: number;

  @ApiProperty({ example: '[1, 2, 3]', isArray: true })
  @Field(() => [Number])
  public readonly path: number[];
}
