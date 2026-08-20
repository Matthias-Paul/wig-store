import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findByGoogleUID(googleUID: string) {
    return this.userRepo.findOne({ where: { googleUID } });
  }

  create(dto: CreateUserDto) {
    const user = this.userRepo.create({
      ...dto,
      role: UserRole.CUSTOMER,
    });
    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    const updatedUser = await this.userRepo.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async findAll(query: GetUsersQueryDto) {
    const { role, page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    // Filter by role
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    // Search by name OR email
    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [users, totalUsers] = await qb.getManyAndCount();

    return {
      users,
      pagination: {
        totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        hasNextPage: page * limit < totalUsers,
      },
    };
  }

  async findAllForNotification(): Promise<User[]> {
    return this.userRepo.find();
  }
}
