import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;

  const usersService = {
    findById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getProfile', () => {
    it('calls findById with active user id and returns result', async () => {
      const profile = { id: 'user-1', name: 'Test' };
      usersService.findById.mockResolvedValue(profile);

      await expect(controller.getProfile('user-1')).resolves.toEqual(profile);
      expect(usersService.findById).toHaveBeenCalledWith('user-1');
    });
  });

  describe('updateProfile', () => {
    it('calls update with user id and dto', async () => {
      const dto = { name: 'New Name' };
      const updated = { id: 'user-1', name: 'New Name' };
      usersService.update.mockResolvedValue(updated);

      await expect(controller.updateProfile('user-1', dto)).resolves.toEqual(
        updated,
      );
      expect(usersService.update).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('getAllUsers', () => {
    it('calls findAll with query and returns result', async () => {
      const query = { page: 1, limit: 10, role: UserRole.ADMIN };
      const list = { users: [], pagination: {} };
      usersService.findAll.mockResolvedValue(list);

      await expect(controller.getAllUsers(query)).resolves.toEqual(list);
      expect(usersService.findAll).toHaveBeenCalledWith(query);
    });
  });
});
