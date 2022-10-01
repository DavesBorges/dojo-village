import { Injectable } from '@nestjs/common';
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
}
