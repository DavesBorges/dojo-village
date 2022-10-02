import { Injectable } from '@nestjs/common';
import { InvalidArgumentException } from '../../exceptions/InvalidArgument';
import { NotFoundException } from '../../exceptions/NotFount';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  async create(createUserDto: CreateUserDto) {
    const idOfCreatedUser = await this.repository.createUser(createUserDto);
    return this.repository.getUserById(idOfCreatedUser);
  }

  findAll() {
    return this.repository.getAllUsers();
  }

  async findOne(id: string) {
    const user = await this.repository.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.repository.updateUser(id, updateUserDto);
    return this.repository.getUserById(id);
  }

  async remove(id: string) {
    const user = await this.repository.getUserById(id);
    await this.repository.deleteUser(id);
    return user;
  }

  findAllUserFriends(userId: string) {
    return this.repository.findUserFriends(userId);
  }

  async findUserFriendById(userId: string, friendId: string) {
    const friend = await this.repository.findUserFriendById(userId, friendId);
    if (!friend) {
      throw new NotFoundException();
    }

    return friend;
  }

  async createFriendRequest(userId: string, friendId: string) {
    const user = await this.repository.getUserById(userId);

    if (!user) {
      throw new InvalidArgumentException('User does not exist');
    }

    if (userId == friendId) {
      throw new InvalidArgumentException(
        'Cannot send a friend request to yourself',
      );
    }

    const friend = await this.repository.getUserById(friendId);
    if (!friend) {
      throw new InvalidArgumentException('Friend does not exist');
    }

    const userFriends = await this.findAllUserFriends(userId);

    const alreadyFriend = await userFriends.find(
      (userFriend) => userFriend.id === friendId,
    );

    if (alreadyFriend) {
      throw new InvalidArgumentException(
        'Already friend or invite already sent',
      );
    }

    await this.repository.createFriend(userId, friendId);
    return this.findUserFriendById(userId, friendId);
  }

  async updateFriendShip(userId: string, friendId: string, status: string) {
    status === 'OK';
    await this.repository.acceptFriendShip(userId, friendId);
    return this.findUserFriendById(userId, friendId);
  }
}
