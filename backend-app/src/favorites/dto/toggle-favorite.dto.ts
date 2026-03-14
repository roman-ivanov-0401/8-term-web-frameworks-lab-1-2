import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ToggleFavoriteDto {
  @ApiProperty()
  @IsInt()
  drink_id: number;
}
