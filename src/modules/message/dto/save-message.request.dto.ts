import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EscapeHtml } from '../decorators/escape-html.decorator';
import { Transform } from 'class-transformer';

@InputType()
export class SaveMessageRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Field()
  public readonly name: string;

  @ApiProperty({ example: 'test@mail.com' })
  @IsEmail()
  @Field()
  public readonly email: string;

  @ApiProperty({ example: 'www.homepage.com' })
  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  public readonly homepage?: string;

  @ApiProperty({ example: 'Some interistng text' })
  @EscapeHtml()
  @IsString()
  @Field()
  public readonly text: string;

  @ApiProperty({ example: '2', description: 'Parent message id' })
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  public readonly replayToId?: number;
}
