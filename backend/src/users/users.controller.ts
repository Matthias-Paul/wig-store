import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@ActiveUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  async updateProfile(
    @ActiveUser('sub') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll(query);
  }
}
