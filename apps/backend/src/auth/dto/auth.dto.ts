import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({ example: 'My Dairy Farm' })
  @IsString()
  farmName: string;

  @ApiProperty({ example: 'Shivam Mishra' })
  @IsString()
  ownerName: string;

  @ApiProperty({ example: '+91-98765-43210' })
  @IsString()
  contactNumber: string;

  @ApiProperty({ example: 'Punjab, India' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @IsNumber()
  totalArea?: number;
}

export class LoginDto {
  @ApiProperty({ example: 'farmer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  password: string;
}

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  credential: string;
}

export class CompleteGoogleSignupDto {
  @ApiProperty()
  @IsString()
  onboardingToken: string;

  @ApiProperty({ example: 'Shivam' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'My Dairy Farm' })
  @IsString()
  farmName: string;

  @ApiProperty({ example: 'Shivam Mishra' })
  @IsString()
  ownerName: string;

  @ApiProperty({ example: '+91-98765-43210' })
  @IsString()
  contactNumber: string;

  @ApiProperty({ example: 'Punjab, India' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @IsNumber()
  totalArea?: number;
}
