import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false, nullable: true })
  farmId: string | null;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

export class AuthOnboardingResponseDto {
  @ApiProperty({ enum: ['ONBOARDING_REQUIRED'] })
  status: 'ONBOARDING_REQUIRED';

  @ApiProperty()
  onboardingToken: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}
