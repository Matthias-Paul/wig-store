import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    return { user, accessToken, refreshToken };
  }
}
