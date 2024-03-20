import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

@InputType()
export class SortRequestDto {
  @ApiProperty({ example: '5', required: false, default: 'email`' })
  @IsOptional()
  @Field({ nullable: true })
  public readonly column?: 'createdAt' | 'name' | 'email';

  @ApiProperty({ example: 'asc', required: false, default: 'desc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  @Field({ nullable: true })
  public readonly order?: 'asc' | 'desc';
}
