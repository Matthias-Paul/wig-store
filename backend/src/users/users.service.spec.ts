import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    googleUID: 'google-uid-1',
    profileImage: 'https://example.com/img.png',
    role: UserRole.CUSTOMER,
    testMigrationField: null as unknown as string,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  const userRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.findById('user-1')).resolves.toEqual(mockUser);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-1' } });
    });
  });

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.findByEmail('test@example.com')).resolves.toEqual(
        mockUser,
      );
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('findByGoogleUID', () => {
    it('returns user when found', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.findByGoogleUID('google-uid-1')).resolves.toEqual(
        mockUser,
      );
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { googleUID: 'google-uid-1' },
      });
    });
  });

  describe('create', () => {
    it('creates and saves user with CUSTOMER role', async () => {
      const dto = {
        email: 'new@example.com',
        name: 'New User',
        googleUID: 'google-new',
      };
      const created = { ...mockUser, ...dto };
      userRepo.create.mockReturnValue(created);
      userRepo.save.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(userRepo.create).toHaveBeenCalledWith({
        ...dto,
        role: UserRole.CUSTOMER,
      });
      expect(userRepo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('updates and returns mapped user fields', async () => {
      userRepo.findOne.mockResolvedValue({ ...mockUser });
      const updated = { ...mockUser, name: 'Updated Name' };
      userRepo.save.mockResolvedValue(updated);

      const result = await service.update('user-1', { name: 'Updated Name' });

      expect(result).toEqual({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profileImage: updated.profileImage,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('throws NotFoundException when user missing', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const setupQueryBuilder = (users: User[], total: number) => {
      const qb = {
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([users, total]),
      };
      userRepo.createQueryBuilder.mockReturnValue(qb);
      return qb;
    };

    it('returns paginated users with defaults', async () => {
      setupQueryBuilder([mockUser], 1);

      const result = await service.findAll({});

      expect(result.users).toEqual([mockUser]);
      expect(result.pagination).toEqual({
        totalUsers: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
      });
    });

    it('applies role and search filters', async () => {
      const qb = setupQueryBuilder([], 0);

      await service.findAll({
        role: UserRole.ADMIN,
        page: 2,
        limit: 5,
        search: 'admin',
      });

      expect(qb.skip).toHaveBeenCalledWith(5);
      expect(qb.take).toHaveBeenCalledWith(5);
      expect(qb.andWhere).toHaveBeenCalledWith('user.role = :role', {
        role: UserRole.ADMIN,
      });
      expect(qb.andWhere).toHaveBeenCalledWith(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: '%admin%' },
      );
    });
  });

  describe('findAllForNotification', () => {
    it('returns all users from repository', async () => {
      userRepo.find.mockResolvedValue([mockUser]);

      await expect(service.findAllForNotification()).resolves.toEqual([
        mockUser,
      ]);
      expect(userRepo.find).toHaveBeenCalled();
    });
  });
});
