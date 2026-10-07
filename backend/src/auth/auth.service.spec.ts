import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as admin from 'firebase-admin';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CartsService } from 'src/carts/carts.service';
import authConfig from '../config/auth.config';
import { UserRole } from 'src/common/enums/user-role.enum';
import type { Response } from 'express';

const verifyIdToken = jest.fn();

jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    verifyIdToken,
  })),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    googleUID: 'google-uid',
    profileImage: 'https://example.com/p.png',
    role: UserRole.CUSTOMER,
  };

  const usersService = {
    findByGoogleUID: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const cartsService = {
    mergeGuestCartIntoUser: jest.fn(),
  };

  const eventEmitter = {
    emit: jest.fn(),
  };

  const authConfiguration = {
    secret: 'access-secret',
    refreshSecret: 'refresh-secret',
    accessExpiresIn: 900,
    refreshExpiresIn: 604800,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: CartsService, useValue: cartsService },
        { provide: EventEmitter2, useValue: eventEmitter },
        { provide: authConfig.KEY, useValue: authConfiguration },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('googleAuth', () => {
    const decodedToken = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/p.png',
      uid: 'google-uid',
    };

    it('returns tokens for existing user by google UID', async () => {
      verifyIdToken.mockResolvedValue(decodedToken);
      usersService.findByGoogleUID.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.googleAuth('valid-id-token');

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(usersService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('creates user and emits event when new google account', async () => {
      verifyIdToken.mockResolvedValue(decodedToken);
      usersService.findByGoogleUID.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      await service.googleAuth('valid-id-token');

      expect(usersService.create).toHaveBeenCalledWith({
        email: decodedToken.email,
        name: decodedToken.name,
        googleUID: decodedToken.uid,
        profileImage: decodedToken.picture,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.registered', {
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('merges guest cart when guestId provided', async () => {
      verifyIdToken.mockResolvedValue(decodedToken);
      usersService.findByGoogleUID.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('token');
      cartsService.mergeGuestCartIntoUser.mockResolvedValue(undefined);

      await service.googleAuth('valid-id-token', 'guest-123');

      expect(cartsService.mergeGuestCartIntoUser).toHaveBeenCalledWith(
        'guest-123',
        mockUser.id,
      );
    });

    it('throws UnauthorizedException for invalid token', async () => {
      verifyIdToken.mockRejectedValue(new Error('invalid'));

      await expect(service.googleAuth('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(admin.auth).toHaveBeenCalled();
    });

    it('throws UnauthorizedException when google account has no email', async () => {
      verifyIdToken.mockResolvedValue({ uid: 'x', email: undefined });

      await expect(service.googleAuth('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws ConflictException when email already registered', async () => {
      verifyIdToken.mockResolvedValue(decodedToken);
      usersService.findByGoogleUID.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue({ id: 'other' });

      await expect(service.googleAuth('token')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getProfile', () => {
    it('returns public profile fields', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      await expect(service.getProfile('user-1')).resolves.toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        profileImage: mockUser.profileImage,
      });
    });

    it('throws NotFoundException when user missing', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getProfile('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('returns new access token for valid refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });
      usersService.findById.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('new-access');

      await expect(service.refreshAccessToken('refresh')).resolves.toEqual({
        accessToken: 'new-access',
      });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh', {
        secret: authConfiguration.refreshSecret,
      });
    });

    it('throws UnauthorizedException for invalid refresh token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('expired'));

      await expect(service.refreshAccessToken('bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when user no longer exists', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'gone' });
      usersService.findById.mockResolvedValue(null);

      await expect(service.refreshAccessToken('refresh')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('clears access and refresh cookies', async () => {
      const res = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      await service.logout(res);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    });
  });
});
