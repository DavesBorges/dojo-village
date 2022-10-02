import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB, Friendship, User } from '../../data/schema-definition';
import { generateUUID } from '../../utils/uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGetManyResponse } from './responses/user-get-many.response';
import { UserGetSingleResponse } from './responses/user-get-single-response';
import '../../utils/kysely.extensions';

interface FriendshipWithUser extends Friendship {
  senderUser: User;
  receiverUser: User;
}
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

  async findUserFriends(userId: string) {
    const friendShipsQueryBuilder = this.constructSearchFriendQuery();

    const friendShips = await friendShipsQueryBuilder
      .where('friendship.sender', '=', userId)
      .orWhere('friendship.receiver', '=', userId)
      .execute();

    return friendShips.map((friendship) =>
      this.extractFriendFromFriendship(friendship, userId),
    );
  }
  async findUserFriendById(userId: string, friendId: string) {
    const friendshipsQueryBuilder = this.constructSearchFriendQuery();

    const friendship = await friendshipsQueryBuilder
      .where((qb) =>
        qb
          .where('friendship.receiver', '=', userId)
          .where('friendship.sender', '=', friendId),
      )
      .orWhere((qb) =>
        qb
          .where('friendship.receiver', '=', friendId)
          .where('friendship.sender', '=', userId),
      )
      .executeTakeFirst();

    if (!friendship) {
      return undefined;
    }

    return this.extractFriendFromFriendship(friendship, userId);
  }

  async createFriend(userId: string, receiver: string) {
    const id = generateUUID();

    const friendShip: Friendship = {
      id,
      sender: userId,
      receiver,
      status: 0,
    };

    await this.database.insertInto('friendship').values(friendShip).execute();
  }

  async acceptFriendShip(userId: string, friend: string) {
    await this.database
      .updateTable('friendship')
      .set({ status: 1 })
      .where('friendship.sender', '=', friend)
      .where('friendship.receiver', '=', userId)
      .execute();
  }

  private constructSearchFriendQuery() {
    return this.database
      .selectFrom('friendship')
      .selectAll('friendship')
      .leftJsonJoin(
        'user as receiverUser',
        'friendship.receiver',
        'receiverUser.id',
        ['id', 'character', 'currentArena', 'name'],
      )
      .leftJsonJoin(
        'user as senderUser',
        'friendship.sender',
        'senderUser.id',
        ['id', 'character', 'currentArena', 'name'],
      );
  }

  private convertFriendShipStatusToString(status: number): string {
    const friendShipToStatusMap = {
      0: 'PENDING',
      1: 'ACCEPTED',
    };

    return friendShipToStatusMap[status];
  }

  private extractFriendFromFriendship(
    friendship: FriendshipWithUser,
    userId: string,
  ) {
    const friend =
      friendship.receiver !== userId
        ? {
            ...JSON.parse(friendship.receiverUser as unknown as string),
            status: this.convertFriendShipStatusToString(friendship.status),
          }
        : {
            ...JSON.parse(friendship.senderUser as unknown as string),
            status: this.convertFriendShipStatusToString(friendship.status),
          };

    return friend;
  }
}
