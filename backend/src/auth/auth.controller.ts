import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AllowAnonymous } from 'src/common/decorators/allow-anonymous.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnonymous()
  @Post('google')
  public async googleAuth(
    @Body() googleAuthDto: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.googleAuth(googleAuthDto.idToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    };
  }

  @Get('me')
  public async getProfile(@ActiveUser('sub') userId: string) {
    return this.authService.getProfile(userId);
  }
}
