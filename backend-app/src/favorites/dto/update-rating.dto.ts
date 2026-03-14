import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
