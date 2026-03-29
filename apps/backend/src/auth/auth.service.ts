import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompleteGoogleSignupDto,
  GoogleAuthDto,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthRateLimitService } from './auth-rate-limit.service';

type AppUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  farmId: string | null;
};

type OnboardingTokenPayload = {
  type: 'google-onboarding';
  email: string;
  googleId: string;
  name: string;
  userId?: string;
};

@Injectable()
export class AuthService {
  private readonly googleClientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '1086488745184-91l5g0rsb04hmr8bquhbgcg628gfbh0h.apps.googleusercontent.com';

  private readonly googleClient = new OAuth2Client(this.googleClientId);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private authRateLimitService: AuthRateLimitService,
  ) {}

  async register(dto: RegisterDto) {
    await this.ensureEmailAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const farm = await tx.farm.create({
        data: {
          name: dto.farmName,
          location: dto.location,
          totalArea: dto.totalArea,
          ownerName: dto.ownerName,
          contactNumber: dto.contactNumber,
        },
      });

      return tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: 'ADMIN',
          farmId: farm.id,
        },
      });
    });

    return this.buildAuthResponse(this.toAuthUser(user));
  }

  async login(dto: LoginDto, ipAddress?: string) {
    const loginKey = this.buildLoginKey(dto.email, ipAddress);
    this.authRateLimitService.assertLoginAllowed(loginKey);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user?.password) {
      this.authRateLimitService.recordLoginFailure(loginKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.authRateLimitService.recordLoginFailure(loginKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.authRateLimitService.clearLoginFailures(loginKey);

    return this.buildAuthResponse(this.toAuthUser(user));
  }

  async loginWithGoogle(dto: GoogleAuthDto) {
    const googleProfile = await this.verifyGoogleCredential(dto.credential);

    const existingByGoogleId = await this.prisma.user.findUnique({
      where: { googleId: googleProfile.googleId },
    });

    if (existingByGoogleId) {
      if (!existingByGoogleId.farmId) {
        return this.buildOnboardingResponse({
          type: 'google-onboarding',
          email: existingByGoogleId.email,
          googleId: googleProfile.googleId,
          name: existingByGoogleId.name || googleProfile.name,
          userId: existingByGoogleId.id,
        });
      }

      return this.buildAuthResponse(this.toAuthUser(existingByGoogleId));
    }

    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: googleProfile.email },
    });

    if (existingByEmail) {
      const updatedUser = await this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          googleId: googleProfile.googleId,
          name: existingByEmail.name || googleProfile.name,
        },
      });

      if (!updatedUser.farmId) {
        return this.buildOnboardingResponse({
          type: 'google-onboarding',
          email: updatedUser.email,
          googleId: googleProfile.googleId,
          name: updatedUser.name || googleProfile.name,
          userId: updatedUser.id,
        });
      }

      return this.buildAuthResponse(this.toAuthUser(updatedUser));
    }

    return this.buildOnboardingResponse({
      type: 'google-onboarding',
      email: googleProfile.email,
      googleId: googleProfile.googleId,
      name: googleProfile.name,
    });
  }

  async completeGoogleSignup(dto: CompleteGoogleSignupDto) {
    const payload = this.verifyOnboardingToken(dto.onboardingToken);

    const user = await this.prisma.$transaction(async (tx) => {
      const farm = await tx.farm.create({
        data: {
          name: dto.farmName,
          location: dto.location,
          totalArea: dto.totalArea,
          ownerName: dto.ownerName,
          contactNumber: dto.contactNumber,
        },
      });

      if (payload.userId) {
        return tx.user.update({
          where: { id: payload.userId },
          data: {
            name: dto.name,
            googleId: payload.googleId,
            role: 'ADMIN',
            farmId: farm.id,
          },
        });
      }

      await this.ensureEmailAvailable(payload.email);

      return tx.user.create({
        data: {
          email: payload.email,
          name: dto.name,
          googleId: payload.googleId,
          role: 'ADMIN',
          farmId: farm.id,
        },
      });
    });

    return this.buildAuthResponse(this.toAuthUser(user));
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        farmId: true,
      },
    });
  }

  private async ensureEmailAvailable(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new BadRequestException('An account with this email already exists');
    }
  }

  private buildAuthResponse(user: AppUser) {
    const token = this.generateToken(user.id, user.email);

    return {
      accessToken: token,
      user,
    };
  }

  private buildOnboardingResponse(payload: OnboardingTokenPayload) {
    return {
      status: 'ONBOARDING_REQUIRED' as const,
      onboardingToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      email: payload.email,
      name: payload.name,
    };
  }

  private verifyOnboardingToken(token: string): OnboardingTokenPayload {
    try {
      const payload = this.jwtService.verify<OnboardingTokenPayload>(token);
      if (payload.type !== 'google-onboarding') {
        throw new Error('Invalid onboarding token');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired onboarding token');
    }
  }

  private async verifyGoogleCredential(credential: string) {
    if (!this.googleClientId) {
      throw new BadRequestException('Google sign-in is not configured');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: this.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub || !payload.email_verified) {
      throw new UnauthorizedException('Unable to verify Google account');
    }

    return this.mapGooglePayload(payload);
  }

  private mapGooglePayload(payload: TokenPayload) {
    return {
      email: payload.email as string,
      googleId: payload.sub,
      name: payload.name || payload.email,
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private buildLoginKey(email: string, ipAddress?: string): string {
    return `${email.toLowerCase()}:${ipAddress || 'unknown'}`;
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    name: string;
    role: string;
    farmId: string | null;
  }): AppUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      farmId: user.farmId,
    };
  }
}
