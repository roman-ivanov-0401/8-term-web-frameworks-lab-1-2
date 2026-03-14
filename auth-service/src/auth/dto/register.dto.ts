import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto as IRegisterDto } from '@shared/index';

export class RegisterDto implements IRegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  user_name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
