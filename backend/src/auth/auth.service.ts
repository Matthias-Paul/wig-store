import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UsersService } from '../users/users.service';
import authConfig from '../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async googleAuth(idToken: string) {
    let decoded: DecodedIdToken;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }

    const { email, name, picture, uid } = decoded;

    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    let user = await this.usersService.findByGoogleUID(uid);

    if (!user) {
      const existingEmail = await this.usersService.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }

      const fallbackName = `${email.split('@')[0]}${Math.floor(100 + Math.random() * 900)}`;

      user = await this.usersService.create({
        email,
        name: name ?? fallbackName,
        googleUID: uid,
        profileImage: picture,
      });
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.accessExpiresIn,
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.authConfiguration.refreshSecret,
        expiresIn: this.authConfiguration.refreshExpiresIn,
      },
    );

    return { user, accessToken, refreshToken };
  }
}
