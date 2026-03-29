import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { getJwtSecret } from '../auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // eslint-disable-next-line no-unused-vars
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    return this.authService.validateUser(payload.sub);
  }
}
