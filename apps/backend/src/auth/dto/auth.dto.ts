import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'farmer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Shivam' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'My Dairy Farm' })
  @IsOptional()
  @IsString()
  farmName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'farmer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  password: string;
}
