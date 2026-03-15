import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;
}
