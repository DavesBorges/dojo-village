import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../data/schema-definition';
import { generateUUID } from '../../utils/uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGetManyResponse } from './responses/user-get-many.response';
import { UserGetSingleResponse } from './responses/user-get-single-response';

@Injectable()
export class UsersRepository {
  private database: Kysely<DB>;
  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async getAllUsers(): Promise<UserGetManyResponse[]> {
    return await this.database
      .selectFrom('user')
      .select(['user.id', 'user.character', 'user.currentArena', 'user.name'])
      .execute();
  }

  async getUserById(id: string): Promise<UserGetSingleResponse> {
    return await this.database
      .selectFrom('user')
      .select(['user.id', 'user.character', 'user.currentArena', 'user.name'])
      .where('user.id', '=', id)
      .executeTakeFirst();
  }

  async createUser(user: CreateUserDto): Promise<string> {
    const id = generateUUID();

    await this.database
      .insertInto('user')
      .values({ ...user, id })
      .executeTakeFirst();
    return id;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.database
      .updateTable('user')
      .set(updateUserDto)
      .where('id', '=', id)
      .execute();
  }

  async deleteUser(id: string): Promise<void> {
    await this.database.deleteFrom('user').where('id', '=', id).execute();
  }
}
