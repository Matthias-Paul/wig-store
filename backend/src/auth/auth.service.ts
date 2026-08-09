import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UsersService } from '../users/users.service';
import authConfig from '../config/auth.config';
import { CartsService } from 'src/carts/carts.service';
import type { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cartsService: CartsService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async googleAuth(idToken: string, guestId?: string) {
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

      this.eventEmitter.emit('user.registered', {
        name: user.name,
        email: user.email,
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to resolve user account');
    }

    if (guestId) {
      await this.cartsService.mergeGuestCartIntoUser(guestId, user.id);
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

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.authConfiguration.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.accessExpiresIn,
      },
    );

    return { accessToken };
  }

  async logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }
}
