import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    googleAuth: jest.fn(),
    logout: jest.fn(),
    refreshAccessToken: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  const mockResponse = (): Response =>
    ({
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    }) as unknown as Response;

  describe('googleAuth', () => {
    it('calls service, sets cookies, and returns user payload', async () => {
      const user = {
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
        profileImage: 'img.png',
      };
      authService.googleAuth.mockResolvedValue({
        user,
        accessToken: 'access',
        refreshToken: 'refresh',
      });
      const res = mockResponse();
      const dto = { idToken: 'google-token', guestId: 'guest-1' };

      const result = await controller.googleAuth(dto, res);

      expect(authService.googleAuth).toHaveBeenCalledWith(
        'google-token',
        'guest-1',
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'access',
        expect.objectContaining({ httpOnly: true, secure: true }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh',
        expect.objectContaining({ httpOnly: true, secure: true }),
      );
      expect(result).toEqual({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    });
  });

  describe('logout', () => {
    it('calls authService.logout and returns message', async () => {
      authService.logout.mockResolvedValue(undefined);
      const res = mockResponse();

      await expect(controller.logout(res)).resolves.toEqual({
        message: 'Logged out successfully',
      });
      expect(authService.logout).toHaveBeenCalledWith(res);
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException when refresh cookie missing', async () => {
      const req = { cookies: {} } as Request;
      const res = mockResponse();

      await expect(controller.refresh(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('refreshes access token and sets cookie', async () => {
      const req = {
        cookies: { refresh_token: 'refresh-value' },
      } as Request;
      const res = mockResponse();
      authService.refreshAccessToken.mockResolvedValue({
        accessToken: 'new-access',
      });

      await expect(controller.refresh(req, res)).resolves.toEqual({
        message: 'Token refreshed',
      });
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(
        'refresh-value',
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'new-access',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });

  describe('getProfile', () => {
    it('delegates to authService.getProfile', async () => {
      const profile = { id: 'user-1', email: 'a@b.com' };
      authService.getProfile.mockResolvedValue(profile);

      await expect(controller.getProfile('user-1')).resolves.toEqual(profile);
      expect(authService.getProfile).toHaveBeenCalledWith('user-1');
    });
  });
});
