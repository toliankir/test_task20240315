import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

@InputType()
export class PaginationRequestDto {
  @ApiProperty({ example: '5', required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(25)
  @Field({ nullable: true })
  public readonly limit?: number;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field({ nullable: true })
  public readonly offset?: number;
}
